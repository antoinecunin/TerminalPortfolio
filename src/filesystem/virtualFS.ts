export type FSNodeType = 'file' | 'directory';

export interface FSFile {
  type: 'file';
  name: string;
  content: string;
}

export interface FSDirectory {
  type: 'directory';
  name: string;
  children: Record<string, FSNode>;
}

export type FSNode = FSFile | FSDirectory;

export class VirtualFS {
  private root: FSDirectory;

  constructor(root: FSDirectory) {
    this.root = root;
  }

  /** Return the current root node. */
  getRoot(): FSDirectory {
    return this.root;
  }

  /** Replace the root node (used for locale-reactive rebuilds). */
  setRoot(root: FSDirectory): void {
    this.root = root;
  }

  /** Resolve a path to a node. Returns null if not found. */
  resolve(path: string, cwd: string): FSNode | null {
    const absolute = this.toAbsolute(path, cwd);
    const parts = this.splitPath(absolute);

    let current: FSNode = this.root;
    for (const part of parts) {
      if (current.type !== 'directory') return null;
      const child: FSNode | undefined = current.children[part];
      if (!child) return null;
      current = child;
    }
    return current;
  }

  /** List children of a directory path. Returns null if not a directory. */
  ls(path: string, cwd: string): FSNode[] | null {
    const node = this.resolve(path, cwd);
    if (!node || node.type !== 'directory') return null;
    return Object.values(node.children).sort((a, b) =>
      a.name.localeCompare(b.name)
    );
  }

  /** Read a file's content. Returns null if not a file. */
  cat(path: string, cwd: string): string | null {
    const node = this.resolve(path, cwd);
    if (!node || node.type !== 'file') return null;
    return node.content;
  }

  /** Check if a path exists and is a directory. */
  isDirectory(path: string, cwd: string): boolean {
    const node = this.resolve(path, cwd);
    return node !== null && node.type === 'directory';
  }

  /** Check if a path exists. */
  exists(path: string, cwd: string): boolean {
    return this.resolve(path, cwd) !== null;
  }

  /** Normalize and resolve a path to absolute. */
  toAbsolute(path: string, cwd: string): string {
    // Replace ~ with home
    let resolved = path.replace(/^~/, '/home/antoine');

    // Make relative paths absolute
    if (!resolved.startsWith('/')) {
      resolved = cwd + '/' + resolved;
    }

    // Normalize: resolve . and ..
    const parts = resolved.split('/').filter(Boolean);
    const stack: string[] = [];
    for (const part of parts) {
      if (part === '.') continue;
      if (part === '..') {
        stack.pop();
      } else {
        stack.push(part);
      }
    }

    return '/' + stack.join('/');
  }

  /** Get all file paths recursively (for grep). */
  getAllFiles(basePath: string, cwd: string): { path: string; content: string }[] {
    const node = this.resolve(basePath, cwd);
    if (!node) return [];

    if (node.type === 'file') {
      return [{ path: this.toAbsolute(basePath, cwd), content: node.content }];
    }

    const results: { path: string; content: string }[] = [];
    const absoluteBase = this.toAbsolute(basePath, cwd);
    this.walkFiles(node, absoluteBase, results);
    return results;
  }

  /** Build a tree structure for display. */
  tree(path: string, cwd: string): TreeEntry[] | null {
    const node = this.resolve(path, cwd);
    if (!node || node.type !== 'directory') return null;
    return this.buildTree(node, '');
  }

  private walkFiles(
    node: FSNode,
    currentPath: string,
    results: { path: string; content: string }[]
  ): void {
    if (node.type === 'file') {
      results.push({ path: currentPath, content: node.content });
      return;
    }
    for (const [name, child] of Object.entries(node.children)) {
      this.walkFiles(child, `${currentPath}/${name}`, results);
    }
  }

  private buildTree(dir: FSDirectory, prefix: string): TreeEntry[] {
    const entries: TreeEntry[] = [];
    const children = Object.values(dir.children).sort((a, b) =>
      a.name.localeCompare(b.name)
    );

    children.forEach((child, i) => {
      const isLast = i === children.length - 1;
      const connector = isLast ? '└── ' : '├── ';
      const childPrefix = isLast ? '    ' : '│   ';

      entries.push({
        text: prefix + connector + child.name,
        isDirectory: child.type === 'directory',
      });

      if (child.type === 'directory') {
        entries.push(...this.buildTree(child, prefix + childPrefix));
      }
    });

    return entries;
  }

  /** Autocomplete a partial path. Returns matching names. */
  completePath(partial: string, cwd: string): string[] {
    // Split into directory part and partial name
    const lastSlash = partial.lastIndexOf('/');
    let dirPath: string;
    let prefix: string;

    if (lastSlash === -1) {
      // No slash — complete in cwd
      dirPath = cwd;
      prefix = partial;
    } else {
      // Has slash — complete inside the directory part
      dirPath = this.toAbsolute(partial.slice(0, lastSlash) || '/', cwd);
      prefix = partial.slice(lastSlash + 1);
    }

    const dirNode = this.resolve(dirPath, cwd);
    if (!dirNode || dirNode.type !== 'directory') return [];

    const matches: string[] = [];
    for (const [name, child] of Object.entries(dirNode.children)) {
      if (name.startsWith(prefix)) {
        // Rebuild the full token with the directory prefix
        const base = lastSlash === -1 ? '' : partial.slice(0, lastSlash + 1);
        const suffix = child.type === 'directory' ? '/' : '';
        matches.push(base + name + suffix);
      }
    }

    return matches.sort();
  }

  private splitPath(absolute: string): string[] {
    return absolute.split('/').filter(Boolean);
  }
}

export interface TreeEntry {
  text: string;
  isDirectory: boolean;
}
