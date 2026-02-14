import type { FSDirectory, FSFile } from './virtualFS';

function file(name: string, content: string): FSFile {
  return { type: 'file', name, content };
}

function dir(name: string, children: Record<string, FSFile | FSDirectory>): FSDirectory {
  return { type: 'directory', name, children };
}

// --- DAG Visualizer source code (embedded from ~/Fun/terminalDAG/) ---

const DRAWDAG_H = `/*
 * drawdag.h - Terminal DAG visualizer
 *
 * Constants, data structures, and public API.
 */

#ifndef DRAWDAG_H
#define DRAWDAG_H

#define _XOPEN_SOURCE_EXTENDED 1

#include <stdbool.h>
#include <stdint.h>
#include <stdio.h>
#include <wchar.h>

/* ---- Limits ---- */

#define MAX_NODES       512
#define MAX_ADJ          64
#define MAX_NAME         64
#define MAX_LEVELS      128
#define MAX_EDGES      4096

/* ---- Layout constants ---- */

#define VERT_SPACING     3
#define EDGE_V_OFFSET    2
#define MIN_COLS_NODE    4
#define CANVAS_MARGIN    1
#define DRAW_MARGIN      1
#define SCROLL_STEP      VERT_SPACING

/* ---- Direction bitmask for connectors ---- */

#define DIR_N  1
#define DIR_S  2
#define DIR_E  4
#define DIR_W  8

/* ---- Data structures ---- */

typedef struct {
    char name[MAX_NAME];
    int adj_in[MAX_ADJ],  in_count;
    int adj_out[MAX_ADJ], out_count;
    int level;
    bool is_dummy;
    bool active;
} Node;

typedef struct {
    Node nodes[MAX_NODES];
    int count;
} Graph;

typedef struct {
    int items[MAX_NODES];
    int count;
} NodeList;

typedef struct {
    wchar_t *cells;
    uint8_t *dirs;
    int width, height;

    int node_col[MAX_NODES];
    int node_row[MAX_NODES];
    int bnd_xs[MAX_NODES], bnd_xe[MAX_NODES], bnd_y[MAX_NODES];
    bool has_bnd[MAX_NODES];

    int *pr, *pc;           /* path row/col pools */
    int ptotal, pcap;
    int ep_src[MAX_EDGES], ep_dst[MAX_EDGES];
    int ep_off[MAX_EDGES],  ep_len[MAX_EDGES];
    int ep_count;
} Canvas;

typedef struct {
    char src[MAX_NAME], dst[MAX_NAME];
} RawEdge;

/* ---- Connector lookup table ---- */

extern const wchar_t CONNECTOR[16];

/* ---- Graph operations ---- */

void graph_init(Graph *g);
int  graph_find(const Graph *g, const char *name);
int  graph_add(Graph *g, const char *name);
int  graph_find_or_add(Graph *g, const char *name);
void graph_add_edge(Graph *g, int src, int dst);
void graph_remove_edge(Graph *g, int src, int dst);
void graph_remove_node(Graph *g, int idx);
void graph_twist(Graph *g, int (*edges)[2], int count);

/* ---- Sugiyama layout ---- */

void sugiyama(const Graph *orig, Graph *out, NodeList *levels, int *level_count);

/* ---- Canvas ---- */

int  canvas_compute_width(const Graph *g, const NodeList *levels,
                          int level_count);
void build_canvas(Canvas *cv, const Graph *g,
                  const NodeList *levels, int level_count, int canvas_width);
void canvas_free(Canvas *cv);

/* ---- Rendering ---- */

void event_loop(const Graph *g, const Canvas *cv);

/* ---- Input parsing ---- */

int read_edges(FILE *fp, RawEdge *edges, int max);
int default_edges(RawEdge *e);

#endif /* DRAWDAG_H */`;

const MAIN_C = `#include "drawdag.h"

#include <locale.h>
#include <ncurses.h>
#include <stdlib.h>
#include <string.h>

static void print_canvas(const Canvas *cv) {
    char buf[MAX_NAME * MAX_NODES];
    for (int row = 0; row < cv->height; row++) {
        int len = 0;
        for (int col = 0; col < cv->width; col++)
            len += wctomb(buf + len, cv->cells[row * cv->width + col]);
        /* trim trailing spaces */
        while (len > 0 && buf[len - 1] == ' ') len--;
        buf[len] = '\\0';
        puts(buf);
    }
}

int main(int argc, char *argv[]) {
    setlocale(LC_ALL, "");

    bool batch = false;
    RawEdge edges[MAX_EDGES];
    int edge_count = 0;
    const char *file_arg = NULL;

    /* parse arguments */
    for (int i = 1; i < argc; i++) {
        if (strcmp(argv[i], "--print") == 0)
            batch = true;
        else
            file_arg = argv[i];
    }

    if (file_arg) {
        FILE *fp;
        if (strcmp(file_arg, "-") == 0) {
            fp = stdin;
        } else {
            fp = fopen(file_arg, "r");
            if (!fp) { perror(file_arg); return 1; }
        }
        edge_count = read_edges(fp, edges, MAX_EDGES);
        if (fp != stdin) fclose(fp);
        if (fp == stdin && !batch && !freopen("/dev/tty", "r", stdin)) {
            fprintf(stderr, "Cannot open /dev/tty\\n");
            return 1;
        }
    } else {
        edge_count = default_edges(edges);
    }

    if (edge_count == 0) { fprintf(stderr, "No edges\\n"); return 1; }

    /* build graph */
    Graph orig;
    graph_init(&orig);
    for (int i = 0; i < edge_count; i++) {
        int src = graph_find_or_add(&orig, edges[i].src);
        int dst = graph_find_or_add(&orig, edges[i].dst);
        graph_add_edge(&orig, src, dst);
    }

    /* layout */
    Graph layout;
    NodeList levels[MAX_LEVELS];
    int level_count;
    sugiyama(&orig, &layout, levels, &level_count);

    int canvas_width = canvas_compute_width(&layout, levels, level_count);

    Canvas cv = {0};
    build_canvas(&cv, &layout, levels, level_count, canvas_width);

    if (batch) {
        print_canvas(&cv);
    } else {
        initscr();
        noecho();
        keypad(stdscr, TRUE);
        event_loop(&layout, &cv);
        endwin();
    }

    canvas_free(&cv);
    return 0;
}`;

const GRAPH_C = `#include "drawdag.h"

#include <string.h>

/* ---- helpers ---- */

static bool has_adj(const int *arr, int count, int val) {
    for (int i = 0; i < count; i++) if (arr[i] == val) return true;
    return false;
}

static void rm_adj(int *arr, int *count, int val) {
    for (int i = 0; i < *count; i++)
        if (arr[i] == val) { arr[i] = arr[--(*count)]; return; }
}

/* ---- public API ---- */

void graph_init(Graph *g) { memset(g, 0, sizeof *g); }

int graph_find(const Graph *g, const char *name) {
    for (int i = 0; i < g->count; i++)
        if (g->nodes[i].active && strcmp(g->nodes[i].name, name) == 0)
            return i;
    return -1;
}

int graph_add(Graph *g, const char *name) {
    if (g->count >= MAX_NODES) return -1;
    int idx = g->count++;
    Node *node = &g->nodes[idx];
    memset(node, 0, sizeof *node);
    snprintf(node->name, MAX_NAME, "%s", name);
    node->active = true;
    return idx;
}

int graph_find_or_add(Graph *g, const char *name) {
    int idx = graph_find(g, name);
    return idx >= 0 ? idx : graph_add(g, name);
}

void graph_add_edge(Graph *g, int src, int dst) {
    Node *s = &g->nodes[src], *d = &g->nodes[dst];
    if (!has_adj(s->adj_out, s->out_count, dst) && s->out_count < MAX_ADJ)
        s->adj_out[s->out_count++] = dst;
    if (!has_adj(d->adj_in, d->in_count, src) && d->in_count < MAX_ADJ)
        d->adj_in[d->in_count++] = src;
}

void graph_remove_edge(Graph *g, int src, int dst) {
    rm_adj(g->nodes[src].adj_out, &g->nodes[src].out_count, dst);
    rm_adj(g->nodes[dst].adj_in,  &g->nodes[dst].in_count,  src);
}

void graph_remove_node(Graph *g, int idx) {
    Node *node = &g->nodes[idx];
    if (!node->active) return;
    for (int i = 0; i < node->in_count; i++)
        rm_adj(g->nodes[node->adj_in[i]].adj_out,
               &g->nodes[node->adj_in[i]].out_count, idx);
    for (int i = 0; i < node->out_count; i++)
        rm_adj(g->nodes[node->adj_out[i]].adj_in,
               &g->nodes[node->adj_out[i]].in_count, idx);
    node->active = false;
    node->in_count = node->out_count = 0;
}

void graph_twist(Graph *g, int (*edges)[2], int count) {
    for (int i = 0; i < count; i++) graph_remove_edge(g, edges[i][0], edges[i][1]);
    for (int i = 0; i < count; i++) graph_add_edge(g, edges[i][1], edges[i][0]);
}`;

const SUGIYAMA_C = `#include "drawdag.h"

#include <stdlib.h>
#include <string.h>

/* ---- Phase 1: topological ordering for cycle breaking ---- */

static void cycle_analysis(const Graph *g, NodeList *order) {
    Graph tmp;
    memcpy(&tmp, g, sizeof tmp);

    NodeList left = {.count = 0}, right = {.count = 0};

    for (;;) {
        bool any_active = false;
        for (int i = 0; i < tmp.count; i++)
            if (tmp.nodes[i].active) { any_active = true; break; }
        if (!any_active) break;

        /* sources (no incoming edges) */
        NodeList batch = {.count = 0};
        for (int i = 0; i < tmp.count; i++)
            if (tmp.nodes[i].active && tmp.nodes[i].in_count == 0)
                batch.items[batch.count++] = i;

        if (batch.count) {
            for (int i = 0; i < batch.count; i++)
                left.items[left.count++] = batch.items[i];
            for (int i = 0; i < batch.count; i++)
                graph_remove_node(&tmp, batch.items[i]);
            continue;
        }

        /* sinks (no outgoing edges) */
        batch.count = 0;
        for (int i = 0; i < tmp.count; i++)
            if (tmp.nodes[i].active && tmp.nodes[i].out_count == 0)
                batch.items[batch.count++] = i;

        if (batch.count) {
            for (int i = 0; i < batch.count; i++)
                right.items[right.count++] = batch.items[i];
            for (int i = 0; i < batch.count; i++)
                graph_remove_node(&tmp, batch.items[i]);
            continue;
        }

        /* max out-rank node (most outgoing minus incoming) */
        int best = -1, best_rank = -999999;
        for (int i = 0; i < tmp.count; i++) {
            if (!tmp.nodes[i].active) continue;
            int rank = tmp.nodes[i].out_count - tmp.nodes[i].in_count;
            if (rank > best_rank) { best_rank = rank; best = i; }
        }
        left.items[left.count++] = best;
        graph_remove_node(&tmp, best);
    }

    order->count = 0;
    for (int i = 0; i < left.count; i++)
        order->items[order->count++] = left.items[i];
    for (int i = 0; i < right.count; i++)
        order->items[order->count++] = right.items[i];
}

/* ---- Phase 1b: reverse backedges ---- */

static void invert_back_edges(const Graph *orig, const NodeList *order,
                              Graph *out) {
    memcpy(out, orig, sizeof *out);

    int position[MAX_NODES];
    memset(position, 0xff, sizeof position);
    for (int i = 0; i < order->count; i++) position[order->items[i]] = i;

    int back_edges[MAX_EDGES][2];
    int back_count = 0;
    for (int i = 0; i < order->count; i++) {
        int node = order->items[i];
        for (int j = 0; j < out->nodes[node].out_count; j++) {
            int child = out->nodes[node].adj_out[j];
            if (position[child] < position[node] && back_count < MAX_EDGES) {
                back_edges[back_count][0] = node;
                back_edges[back_count][1] = child;
                back_count++;
            }
        }
    }
    graph_twist(out, back_edges, back_count);
}

/* ---- Phase 2: assign nodes to levels ---- */

static void level_assignment(const Graph *g, NodeList *levels,
                             int *level_count) {
    Graph tmp;
    memcpy(&tmp, g, sizeof tmp);
    *level_count = 0;

    for (;;) {
        bool any_active = false;
        for (int i = 0; i < tmp.count; i++)
            if (tmp.nodes[i].active) { any_active = true; break; }
        if (!any_active) break;

        NodeList *level = &levels[*level_count];
        level->count = 0;
        for (int i = 0; i < tmp.count; i++)
            if (tmp.nodes[i].active && tmp.nodes[i].out_count == 0)
                level->items[level->count++] = i;
        (*level_count)++;
        for (int i = 0; i < level->count; i++)
            graph_remove_node(&tmp, level->items[i]);
    }

    /* reverse (built bottom-up) */
    for (int i = 0; i < *level_count / 2; i++) {
        NodeList swap = levels[i];
        levels[i] = levels[*level_count - 1 - i];
        levels[*level_count - 1 - i] = swap;
    }
}

/* ---- Phase 2b: insert dummy nodes on multi-level edges ---- */

static void solve_mid_transition(Graph *g, int src, int dst,
                                 NodeList *levels, int *dummy_id) {
    int level_from = g->nodes[src].level;
    int level_to   = g->nodes[dst].level;
    int span = abs(level_to - level_from) - 1;
    if (span <= 0) return;
    if (g->count + span > MAX_NODES) return;

    int step = (level_to > level_from) ? 1 : -1;
    graph_remove_edge(g, src, dst);

    int prev = src;
    for (int lvl = level_from + step; lvl != level_to; lvl += step) {
        int dummy = g->count++;
        Node *dn = &g->nodes[dummy];
        memset(dn, 0, sizeof *dn);
        snprintf(dn->name, MAX_NAME, "_d%d", (*dummy_id)++);
        dn->active = true;
        dn->is_dummy = true;
        dn->level = lvl;
        g->nodes[prev].adj_out[g->nodes[prev].out_count++] = dummy;
        dn->adj_in[dn->in_count++] = prev;
        levels[lvl].items[levels[lvl].count++] = dummy;
        prev = dummy;
    }
    g->nodes[prev].adj_out[g->nodes[prev].out_count++] = dst;
    g->nodes[dst].adj_in[g->nodes[dst].in_count++] = prev;
}

static void get_in_between_nodes(const Graph *orig, Graph *out,
                                 NodeList *levels, int level_count) {
    memcpy(out, orig, sizeof *out);
    for (int i = 0; i < level_count; i++)
        for (int j = 0; j < levels[i].count; j++)
            out->nodes[levels[i].items[j]].level = i;

    int multi_edges[MAX_EDGES][2];
    int multi_count = 0;
    for (int lvl = 0; lvl < level_count; lvl++)
        for (int j = 0; j < levels[lvl].count; j++) {
            int node = levels[lvl].items[j];
            for (int k = 0; k < out->nodes[node].out_count; k++) {
                int child = out->nodes[node].adj_out[k];
                if (abs(out->nodes[child].level - lvl) > 1
                    && multi_count < MAX_EDGES) {
                    multi_edges[multi_count][0] = node;
                    multi_edges[multi_count][1] = child;
                    multi_count++;
                }
            }
        }

    int dummy_id = 0;
    for (int i = 0; i < multi_count; i++)
        solve_mid_transition(out, multi_edges[i][0], multi_edges[i][1],
                             levels, &dummy_id);
}

/* ---- Phase 3: crossing minimisation ---- */

static int neighbor_indices(const Graph *g, int node,
                            const NodeList *level, int *out) {
    int count = 0;
    for (int i = 0; i < g->nodes[node].out_count; i++) {
        int neighbor = g->nodes[node].adj_out[i];
        for (int j = 0; j < level->count; j++)
            if (level->items[j] == neighbor) { out[count++] = j; break; }
    }
    for (int i = 0; i < g->nodes[node].in_count; i++) {
        int neighbor = g->nodes[node].adj_in[i];
        for (int j = 0; j < level->count; j++)
            if (level->items[j] == neighbor) { out[count++] = j; break; }
    }
    return count;
}

static void cost_matrix(const Graph *g, const NodeList *upper,
                        const NodeList *lower, int *matrix) {
    int n = upper->count;
    memset(matrix, 0, MAX_NODES * MAX_NODES * sizeof(int));

    for (int ui = 0; ui < n; ui++)
        for (int vi = ui + 1; vi < n; vi++) {
            int idx_u[MAX_ADJ * 2], idx_v[MAX_ADJ * 2];
            int count_u = neighbor_indices(g, upper->items[ui], lower, idx_u);
            int count_v = neighbor_indices(g, upper->items[vi], lower, idx_v);
            for (int a = 0; a < count_u; a++)
                for (int b = 0; b < count_v; b++) {
                    if (idx_u[a] > idx_v[b]) matrix[ui * MAX_NODES + vi]++;
                    if (idx_u[a] < idx_v[b]) matrix[vi * MAX_NODES + ui]++;
                }
        }
}

static void cross_sort(const int *indices, int count, const int *matrix,
                       int *out, int *out_count) {
    if (count < 2) {
        memcpy(out, indices, count * sizeof *indices);
        *out_count = count;
        return;
    }
    int pivot = count / 2;
    int left[MAX_NODES], left_count;
    int right_half[MAX_NODES], right_count;
    cross_sort(indices, pivot, matrix, left, &left_count);
    cross_sort(indices + pivot, count - pivot, matrix,
               right_half, &right_count);

    int li = 0, ri = 0;
    *out_count = 0;
    while (li < left_count && ri < right_count) {
        if (matrix[left[li] * MAX_NODES + right_half[ri]] <=
            matrix[right_half[ri] * MAX_NODES + left[li]])
            out[(*out_count)++] = left[li++];
        else
            out[(*out_count)++] = right_half[ri++];
    }
    while (li < left_count) out[(*out_count)++] = left[li++];
    while (ri < right_count) out[(*out_count)++] = right_half[ri++];
}

static void two_level_cross_min(const Graph *g, NodeList *levels,
                                int level_count) {
    if (level_count < 2) return;

    int *matrix = malloc(MAX_NODES * MAX_NODES * sizeof(int));
    if (!matrix) return;

    NodeList result[MAX_LEVELS];
    int result_count = 0;
    result[result_count++] = levels[level_count - 1];

    for (int i = level_count - 2; i >= 0; i--) {
        cost_matrix(g, &levels[i], &result[result_count - 1], matrix);
        int indices[MAX_NODES], sorted[MAX_NODES], sorted_count;
        for (int j = 0; j < levels[i].count; j++) indices[j] = j;
        cross_sort(indices, levels[i].count, matrix, sorted, &sorted_count);

        NodeList reordered = {.count = 0};
        for (int j = 0; j < sorted_count; j++)
            reordered.items[reordered.count++] = levels[i].items[sorted[j]];
        result[result_count++] = reordered;
    }
    for (int i = 0; i < result_count; i++)
        levels[i] = result[result_count - 1 - i];

    free(matrix);
}

/* ---- Main entry point ---- */

void sugiyama(const Graph *orig, Graph *out,
              NodeList *levels, int *level_count) {
    NodeList order;
    cycle_analysis(orig, &order);

    Graph acyclic;
    invert_back_edges(orig, &order, &acyclic);
    level_assignment(&acyclic, levels, level_count);
    get_in_between_nodes(orig, out, levels, *level_count);
    two_level_cross_min(out, levels, *level_count);
}`;

const CANVAS_C = `#include "drawdag.h"

#include <math.h>
#include <stdlib.h>
#include <string.h>

/* ---- Connector lookup table ---- */

const wchar_t CONNECTOR[16] = {
    L' ',  L'\\u2565', L'\\u2567', L'\\u2502',
    L'\\u2576', L'\\u2514', L'\\u250c', L'\\u251c',
    L'\\u2574', L'\\u2518', L'\\u2510', L'\\u2524',
    L'\\u2500', L'\\u2534', L'\\u252c', L'\\u253c',
};

/* ---- helpers ---- */

static void path_push(Canvas *cv, int row, int col) {
    if (cv->ptotal >= cv->pcap) {
        int new_cap = cv->pcap ? cv->pcap * 2 : 8192;
        int *new_pr = realloc(cv->pr, new_cap * sizeof *cv->pr);
        if (!new_pr) return;
        cv->pr = new_pr;
        int *new_pc = realloc(cv->pc, new_cap * sizeof *cv->pc);
        if (!new_pc) return;
        cv->pc = new_pc;
        cv->pcap = new_cap;
    }
    cv->pr[cv->ptotal] = row;
    cv->pc[cv->ptotal] = col;
    cv->ptotal++;
}

static void add_dir(Canvas *cv, int x, int y, uint8_t d) {
    if (y >= 0 && y < cv->height && x >= 0 && x < cv->width)
        cv->dirs[y * cv->width + x] |= d;
}

static void draw_vline(Canvas *cv, int x, int y0, int y1) {
    int s = (y1 > y0) ? 1 : -1;
    int y = y0;
    while (y != y1) {
        add_dir(cv, x, y, s > 0 ? DIR_S : DIR_N);
        path_push(cv, y, x);
        y += s;
        add_dir(cv, x, y, s > 0 ? DIR_N : DIR_S);
    }
    path_push(cv, y1, x);
}

static void draw_hline(Canvas *cv, int y, int x0, int x1) {
    int s = (x1 > x0) ? 1 : -1;
    int x = x0;
    while (x != x1) {
        add_dir(cv, x, y, s > 0 ? DIR_E : DIR_W);
        path_push(cv, y, x);
        x += s;
        add_dir(cv, x, y, s > 0 ? DIR_W : DIR_E);
    }
    path_push(cv, y, x1);
}

/* ---- internal steps ---- */

static void canvas_place_nodes(Canvas *cv, const NodeList *levels,
                               int level_count) {
    for (int lvl = 0; lvl < level_count; lvl++) {
        int nodes_in_level = levels[lvl].count;
        if (nodes_in_level == 0) nodes_in_level = 1;
        for (int ni = 0; ni < levels[lvl].count; ni++) {
            int node = levels[lvl].items[ni];
            cv->node_col[node] = (int)round(
                (ni + 0.5) / (double)nodes_in_level * (cv->width - 1));
            cv->node_row[node] = VERT_SPACING * lvl;
        }
    }
}

static void canvas_route_edges(Canvas *cv, const Graph *g) {
    cv->pr = NULL; cv->pc = NULL;
    cv->ptotal = cv->pcap = 0;
    cv->ep_count = 0;

    for (int i = 0; i < g->count; i++) {
        if (!g->nodes[i].active) continue;
        int src_col = cv->node_col[i], src_row = cv->node_row[i];
        int edge_row = src_row + EDGE_V_OFFSET;
        for (int j = 0; j < g->nodes[i].out_count; j++) {
            int dst = g->nodes[i].adj_out[j];
            int dst_col = cv->node_col[dst], dst_row = cv->node_row[dst];
            int path_offset = cv->ptotal;
            draw_vline(cv, src_col, src_row, edge_row);
            draw_hline(cv, edge_row, src_col, dst_col);
            draw_vline(cv, dst_col, edge_row, dst_row);
            if (cv->ep_count < MAX_EDGES) {
                int edge_idx = cv->ep_count++;
                cv->ep_src[edge_idx] = i;
                cv->ep_dst[edge_idx] = dst;
                cv->ep_off[edge_idx] = path_offset;
                cv->ep_len[edge_idx] = cv->ptotal - path_offset;
            }
        }
    }
}

static void canvas_stamp_glyphs(Canvas *cv, const Graph *g) {
    for (int i = 0; i < cv->height * cv->width; i++)
        cv->cells[i] = CONNECTOR[cv->dirs[i]];

    memset(cv->has_bnd, 0, sizeof cv->has_bnd);
    for (int i = 0; i < g->count; i++) {
        if (!g->nodes[i].active || g->nodes[i].is_dummy) continue;
        int col = cv->node_col[i], row = cv->node_row[i];
        int label_len = (int)strlen(g->nodes[i].name);
        int label_start = col - label_len / 2;
        for (int c = 0; c < label_len; c++) {
            int x = label_start + c;
            if (x >= 0 && x < cv->width)
                cv->cells[row * cv->width + x] =
                    (wchar_t)g->nodes[i].name[c];
        }
        cv->bnd_xs[i] = label_start;
        cv->bnd_xe[i] = label_start + label_len - 1;
        cv->bnd_y[i]  = row;
        cv->has_bnd[i] = true;
    }
}

/* ---- public API ---- */

int canvas_compute_width(const Graph *g, const NodeList *levels,
                         int level_count) {
    int max_label = 1;
    for (int i = 0; i < g->count; i++)
        if (g->nodes[i].active && !g->nodes[i].is_dummy) {
            int len = (int)strlen(g->nodes[i].name);
            if (len > max_label) max_label = len;
        }
    int cols_per_node = max_label + 2;
    if (cols_per_node < MIN_COLS_NODE) cols_per_node = MIN_COLS_NODE;
    int max_level_size = 1;
    for (int i = 0; i < level_count; i++)
        if (levels[i].count > max_level_size)
            max_level_size = levels[i].count;
    return cols_per_node * max_level_size + CANVAS_MARGIN;
}

void build_canvas(Canvas *cv, const Graph *g,
                  const NodeList *levels, int level_count, int canvas_width) {
    cv->width = canvas_width;
    cv->height = VERT_SPACING * level_count + CANVAS_MARGIN;
    cv->cells = calloc(cv->height * cv->width, sizeof *cv->cells);
    cv->dirs  = calloc(cv->height * cv->width, sizeof *cv->dirs);
    if (!cv->cells || !cv->dirs) return;
    for (int i = 0; i < cv->height * cv->width; i++) cv->cells[i] = L' ';

    canvas_place_nodes(cv, levels, level_count);
    canvas_route_edges(cv, g);
    canvas_stamp_glyphs(cv, g);
}

void canvas_free(Canvas *cv) {
    free(cv->cells); free(cv->dirs);
    free(cv->pr);    free(cv->pc);
}`;

const RENDER_C = `#include "drawdag.h"

#include <ncurses.h>
#include <stdlib.h>
#include <string.h>

/* ---- helpers ---- */

static void mark_edge_path(bool *highlight, const Canvas *cv,
                           int src, int dst) {
    for (int e = 0; e < cv->ep_count; e++) {
        if (cv->ep_src[e] == src && cv->ep_dst[e] == dst) {
            for (int p = 0; p < cv->ep_len[e]; p++) {
                int row = cv->pr[cv->ep_off[e] + p];
                int col = cv->pc[cv->ep_off[e] + p];
                highlight[row * cv->width + col] = true;
            }
            break;
        }
    }
}

static void compute_highlight(bool *highlight, const Canvas *cv,
                              const Graph *g, int selected) {
    memset(highlight, 0, cv->width * cv->height * sizeof *highlight);
    if (selected < 0) return;

    bool connected[MAX_NODES] = {0};
    bool visited[MAX_NODES];
    int stack[MAX_NODES];
    int stack_top;

    /* forward traversal */
    stack_top = 0; memset(visited, 0, sizeof visited);
    stack[stack_top++] = selected;
    while (stack_top > 0) {
        int node = stack[--stack_top];
        if (visited[node]) continue;
        visited[node] = true;
        for (int i = 0; i < g->nodes[node].out_count; i++) {
            int neighbor = g->nodes[node].adj_out[i];
            mark_edge_path(highlight, cv, node, neighbor);
            if (g->nodes[neighbor].is_dummy) stack[stack_top++] = neighbor;
            else                             connected[neighbor] = true;
        }
    }

    /* backward traversal */
    stack_top = 0; memset(visited, 0, sizeof visited);
    stack[stack_top++] = selected;
    while (stack_top > 0) {
        int node = stack[--stack_top];
        if (visited[node]) continue;
        visited[node] = true;
        for (int i = 0; i < g->nodes[node].in_count; i++) {
            int neighbor = g->nodes[node].adj_in[i];
            mark_edge_path(highlight, cv, neighbor, node);
            if (g->nodes[neighbor].is_dummy) stack[stack_top++] = neighbor;
            else                             connected[neighbor] = true;
        }
    }

    /* highlight connected node labels */
    for (int i = 0; i < g->count; i++) {
        if (!connected[i] || !cv->has_bnd[i]) continue;
        int row = cv->bnd_y[i];
        for (int x = cv->bnd_xs[i]; x <= cv->bnd_xe[i]; x++)
            if (x >= 0 && x < cv->width)
                highlight[row * cv->width + x] = true;
    }
}

static void render(WINDOW *win, const Canvas *cv, const bool *highlight,
                   int selected, int scroll_x, int scroll_y) {
    int max_row, max_col;
    getmaxyx(win, max_row, max_col);
    int draw_width = max_col - DRAW_MARGIN;
    cchar_t cch;
    wchar_t wstr[2] = {0, 0};

    for (int screen_row = 0; screen_row < max_row; screen_row++) {
        int canvas_row = scroll_y + screen_row;
        if (canvas_row >= cv->height) break;
        for (int screen_col = 0; screen_col < draw_width; screen_col++) {
            int canvas_col = scroll_x + screen_col;
            if (canvas_col >= cv->width) break;
            wchar_t ch = cv->cells[canvas_row * cv->width + canvas_col];
            attr_t attr;
            short pair;
            if (highlight[canvas_row * cv->width + canvas_col])
                                     { attr = A_BOLD;   pair = 2; }
            else if (ch != L' ')     { attr = A_NORMAL; pair = 1; }
            else                     { attr = A_NORMAL; pair = 0; }
            wstr[0] = ch;
            setcchar(&cch, wstr, attr, pair, NULL);
            mvadd_wch(screen_row, screen_col, &cch);
        }
    }

    /* highlight selected node label */
    if (selected >= 0 && cv->has_bnd[selected]) {
        int row = cv->bnd_y[selected];
        int screen_y = row - scroll_y;
        if (screen_y >= 0 && screen_y < max_row) {
            for (int x = cv->bnd_xs[selected]; x <= cv->bnd_xe[selected]; x++) {
                int screen_x = x - scroll_x;
                if (screen_x >= 0 && screen_x < draw_width) {
                    wstr[0] = cv->cells[row * cv->width + x];
                    setcchar(&cch, wstr, A_REVERSE, 2, NULL);
                    mvadd_wch(screen_y, screen_x, &cch);
                }
            }
        }
    }
}

static int find_clicked(const Canvas *cv, int node_count,
                        int abs_x, int abs_y) {
    for (int i = 0; i < node_count; i++)
        if (cv->has_bnd[i] && abs_y == cv->bnd_y[i] &&
            abs_x >= cv->bnd_xs[i] && abs_x <= cv->bnd_xe[i])
            return i;
    return -1;
}

/* ---- setup ---- */

static void render_setup(mmask_t *scroll_up, mmask_t *scroll_down) {
    curs_set(0);
    mousemask(ALL_MOUSE_EVENTS | REPORT_MOUSE_POSITION, NULL);
    start_color();
    use_default_colors();
    init_pair(1, COLOR_WHITE, -1);
    init_pair(2, COLOR_YELLOW, -1);

    *scroll_up = 0;
    *scroll_down = 0;
#ifdef BUTTON4_PRESSED
    *scroll_up = BUTTON4_PRESSED;
#endif
#ifdef BUTTON5_PRESSED
    *scroll_down = BUTTON5_PRESSED;
#endif
    if (*scroll_up && !*scroll_down)
        *scroll_down = *scroll_up << 5;
    if (*scroll_down && !*scroll_up)
        *scroll_up = *scroll_down >> 5;
}

/* ---- public API ---- */

void event_loop(const Graph *g, const Canvas *cv) {
    mmask_t scroll_up_mask, scroll_down_mask;
    render_setup(&scroll_up_mask, &scroll_down_mask);

    int scroll_x = 0, scroll_y = 0, selected = -1;
    bool *highlight = calloc(cv->width * cv->height, sizeof *highlight);
    if (!highlight) return;

    for (;;) {
        int term_rows, term_cols;
        getmaxyx(stdscr, term_rows, term_cols);
        int max_scroll_x = cv->width > term_cols ?
                           cv->width - term_cols : 0;
        int max_scroll_y = cv->height > (term_rows - DRAW_MARGIN) ?
                           cv->height - (term_rows - DRAW_MARGIN) : 0;
        if (scroll_x < 0) scroll_x = 0;
        if (scroll_x > max_scroll_x) scroll_x = max_scroll_x;
        if (scroll_y < 0) scroll_y = 0;
        if (scroll_y > max_scroll_y) scroll_y = max_scroll_y;

        compute_highlight(highlight, cv, g, selected);
        erase();
        render(stdscr, cv, highlight, selected, scroll_x, scroll_y);
        refresh();

        int key = getch();
        if (key == 'q' || key == 'Q') break;
        else if (key == ' ')                            selected = -1;
        else if (key == KEY_LEFT  || key == 'a')        scroll_x -= SCROLL_STEP;
        else if (key == KEY_RIGHT || key == 'd')        scroll_x += SCROLL_STEP;
        else if (key == KEY_UP    || key == 'z')        scroll_y -= SCROLL_STEP;
        else if (key == KEY_DOWN  || key == 's')        scroll_y += SCROLL_STEP;
        else if (key == KEY_MOUSE) {
            MEVENT mouse;
            if (getmouse(&mouse) == OK) {
                if (scroll_up_mask && (mouse.bstate & scroll_up_mask))
                    scroll_y -= SCROLL_STEP;
                else if (scroll_down_mask && (mouse.bstate & scroll_down_mask))
                    scroll_y += SCROLL_STEP;
                else if (mouse.bstate & BUTTON1_CLICKED) {
                    int clicked = find_clicked(cv, g->count,
                                              mouse.x + scroll_x,
                                              mouse.y + scroll_y);
                    selected = (clicked == selected) ? -1 : clicked;
                }
            }
        }
    }
    free(highlight);
}`;

const PARSE_C = `#include "drawdag.h"

#include <string.h>

int read_edges(FILE *fp, RawEdge *edges, int max) {
    int n = 0;
    char line[256];
    while (fgets(line, sizeof line, fp) && n < max) {
        char *p = line;
        while (*p == ' ' || *p == '\\t') p++;
        if (*p == '#' || *p == '\\n' || *p == '\\0') continue;
        if (sscanf(p, "%63s %63s", edges[n].src, edges[n].dst) == 2) n++;
    }
    return n;
}

int default_edges(RawEdge *e) {
    static const char *d[][2] = {
        {"init","parse"},     {"init","config"},
        {"fetch","transform"},{"parse","fetch"},
        {"parse","validate"}, {"parse","build"},
        {"config","lint"},    {"config","transform"},
        {"config","build"},   {"config","deploy"},
        {"transform","bundle"},{"validate","bundle"},
        {"validate","test"},  {"build","validate"},
        {"deploy","test"},    {"bundle","publish"},
        {"test","publish"},
    };
    int n = sizeof d / sizeof d[0];
    for (int i = 0; i < n; i++) {
        snprintf(e[i].src, MAX_NAME, "%s", d[i][0]);
        snprintf(e[i].dst, MAX_NAME, "%s", d[i][1]);
    }
    return n;
}`;

const MAKEFILE = `CC      = gcc
CFLAGS  = -Wall -Wextra -O2
LDFLAGS = -lncursesw -lm
TARGET  = drawdag

SRCS    = src/main.c src/graph.c src/sugiyama.c src/canvas.c src/render.c src/parse.c
OBJS    = $(SRCS:.c=.o)

$(TARGET): $(OBJS)
\t$(CC) $(CFLAGS) -o $@ $(OBJS) $(LDFLAGS)

src/%.o: src/%.c src/drawdag.h
\t$(CC) $(CFLAGS) -c -o $@ $<

debug: CFLAGS = -Wall -Wextra -g -O0
debug: $(TARGET)

valgrind: debug
\tvalgrind --leak-check=full --show-leak-kinds=all --error-exitcode=1 \\
\t\t./$(TARGET) --print
\t@echo "=== valgrind: OK ==="

valgrind-file: debug edges.txt
\tvalgrind --leak-check=full --show-leak-kinds=all --error-exitcode=1 \\
\t\t./$(TARGET) --print edges.txt
\t@echo "=== valgrind (file): OK ==="

clean:
\trm -f $(TARGET) src/*.o

.PHONY: clean debug valgrind valgrind-file`;

const README_MD = `# drawdag

A lightweight, free terminal DAG (Directed Acyclic Graph) visualizer built for
SSH-friendly environments and Unix pipelines.

This project started as a Python prototype during an internship at
[EOST](https://eost.unistra.fr/) (École et Observatoire des Sciences de la
Terre, Strasbourg) and has since been rewritten in C for performance and
portability.

\`\`\`
      A
      |
  +---+---+
  B   C   |
  |   |   |
  +--++  -+
   D     E
   |     |
   +--+--+
      F
\`\`\`

## Features

- **Sugiyama hierarchical layout** - automatic cycle breaking, level assignment,
  dummy node insertion, and crossing minimisation
- **Interactive ncurses mode** - click a node to highlight its connected edges
  and neighbors, scroll with keyboard or mouse wheel
- **Batch mode** (\`--print\`) - plain text output for piping into other tools
- **Minimal dependencies** - only requires ncurses and a C compiler
- **SSH-compatible** - uses Unicode box-drawing characters, works over any
  terminal

## Building

Requires \`gcc\` and \`libncursesw\` (wide-character ncurses).

\`\`\`sh
# Debian/Ubuntu
sudo apt install libncursesw5-dev

# Build
make
\`\`\`

## Usage

\`\`\`sh
# Interactive mode with built-in demo graph
./drawdag

# Interactive mode with a custom edge list
./drawdag edges.txt

# Read from stdin
cat edges.txt | ./drawdag -

# Batch print (no ncurses, plain text output)
./drawdag --print edges.txt
\`\`\`

### Edge file format

One edge per line: \`FROM TO\` (whitespace-separated). Lines starting with \`#\`
are comments. See [edges.txt](edges.txt) for a full example.

### Interactive controls

| Key              | Action                  |
|------------------|-------------------------|
| Click on a node  | Select / deselect       |
| Space            | Deselect                |
| Arrows / \`azsd\`  | Scroll                  |
| Mouse wheel      | Scroll vertically       |
| \`q\`              | Quit                    |

## Project structure

\`\`\`
src/
  drawdag.h    — shared types, constants, public API
  graph.c      — graph data structure and operations
  sugiyama.c   — Sugiyama layout algorithm
  canvas.c     — canvas construction and glyph rendering
  render.c     — ncurses interactive display
  parse.c      — edge list parser
  main.c       — entry point
\`\`\`

## License

This project is free software, licensed under the
[GNU General Public License v3.0](LICENSE).`;

const EDGES_TXT = `# Example DAG: build pipeline
init parse
init config
fetch transform
parse fetch
parse validate
parse build
config lint
config transform
config build
config deploy
transform bundle
validate bundle
validate test
build validate
deploy test
bundle publish
test publish`;

// --- Builder ---

const SSH_FILESYSTEMS: Record<string, () => FSDirectory> = {
  'dag-visualizer': () =>
    dir('antoine', {
      'README.md': file('README.md', README_MD),
      'Makefile': file('Makefile', MAKEFILE),
      'edges.txt': file('edges.txt', EDGES_TXT),
      src: dir('src', {
        'drawdag.h': file('drawdag.h', DRAWDAG_H),
        'main.c': file('main.c', MAIN_C),
        'graph.c': file('graph.c', GRAPH_C),
        'sugiyama.c': file('sugiyama.c', SUGIYAMA_C),
        'canvas.c': file('canvas.c', CANVAS_C),
        'render.c': file('render.c', RENDER_C),
        'parse.c': file('parse.c', PARSE_C),
      }),
    }),
};

export function buildSSHRoot(projectId: string): FSDirectory | null {
  const builder = SSH_FILESYSTEMS[projectId];
  if (!builder) return null;

  const homeDir = builder();
  return dir('/', {
    home: dir('home', {
      antoine: homeDir,
    }),
  });
}

export function getSSHProjects(): string[] {
  return Object.keys(SSH_FILESYSTEMS);
}
