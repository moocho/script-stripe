# delivery-core

## Git Workflow

When ready to merge your feature branch into the `develop` branch, **submit a pull request**.

After the pull request has been reviewed and approved, be sure to **squash all of your commits into one** before merging.


To squash, follow these commands:

(_Note, here we are merging `feature-branch` into `develop` in this example._)

1. First, get the latest changes on the `develop` branch.

```
git checkout develop
```

```
git pull origin develop
```

2. Switch back to `feature-branch`, and rebase it:

```
git rebase -i develop
```

3. Set all commits after the first one to squash. If you run into conflicts while rebasing, fix the conflicts and use:

```
git rebase --continue
```

4. Push the changes to the `feature-branch`:

```
git push -f origin feature-branch
```

5. That's it! Now merge the branch! You are now a git ninja! 🙌
