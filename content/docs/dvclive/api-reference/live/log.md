# Live.log()

Logs the given scalar `val` associating it with the given `name`.

```py
 def log(name: str, val: float):
```

#### Usage:

```py
from dvclive import Live

live = Live()

live.log("loss", 0.1)
live.log("acc", 0.9)
```

## Description

If [`summary`](/doc/dvclive/api-reference/live/#parameters) is enabled, on each
`live.log(name, val)` call DVCLive will add a `name` entry in `{path.json}` with
the corresponding `val`:

```dvc
$ cat dvclive.json
{
  "loss": 0.1,
  "acc": 0.9
}
```

💡 The summary `{path}.json` is usable by `dvc metrics` and
`dvc exp show`/`dvc exp diff`.

### Step updates

The first `step` update (with `Live.next_step()` or `Live.set_step()`) will
create a _metrics history_ file in `{path}/scalars/{name}.tsv`:

```
timestamp step  loss
1623671484747 0 0.9
```

Each subsequent call to `live.log(name, val)` will add a new row to
`{path}/scalars/{name}.tsv`.

```dvc
$ tree
├── dvclive
│   └── scalars
│       ├── acc.tsv
│       └── loss.tsv
└── dvclive.json
```

💡 The metrics history (`{path}/scalars/{name}.tsv`) is usable by `dvc plots`.

If `name` contains slashes (e.g. `train/loss`), the required subdirectories will
be created and the file will be saved inside the last one (e.g.
`{path}/scalars/train/loss.tsv`).

## Parameters

- `name` - Name of the scalar being logged.

- `val` - The value to be logged.

## Exceptions

- `dvclive.error.InvalidDataTypeError` - thrown if the provided `val` does not
  have a supported type.

- `dvclive.error.DataAlreadyLoggedError` - thrown if the provided `name` has
  already been logged within the same `step`.
