# Fountain Extension Release Process

This document outlines the actual working release process for the Fountain extension for Zed editor, based on real-world experience with v0.1.0 release.

## Repository Structure

The Fountain extension consists of three interconnected repositories:

1. **`LaPingvino/tree-sitter-fountain`**: Grammar parser with Unicode support
2. **`LaPingvino/zed-fountain`**: Main extension repository 
3. **`LaPingvino/zed-extensions-fountain`**: Fork of `zed-industries/extensions`

## Release Flow Overview

The release process involves updating components in order and coordinating between repositories:

```
tree-sitter-fountain → zed-fountain → zed-extensions-fountain → PR to upstream
```

## Step-by-Step Release Process

### 1. Update Tree-Sitter Grammar

```bash
cd tree-sitter-fountain

# Make grammar changes and test
tree-sitter generate
tree-sitter test

# Commit changes
git add .
git commit -m "Fix Unicode support for international screenwriting"
git push origin main

# Note the FULL commit hash for next step
git rev-parse HEAD
# Example: 2d943e1e3ec8426ab4ae2d5d27c799a5760ebfdb
```

### 2. Update Main Extension Repository

```bash
cd zed-fountain

# Update extension.toml with new version and tree-sitter commit
# CRITICAL: Use FULL commit hash for tree-sitter reference
```

Edit `extension.toml`:
```toml
id = "fountain"
name = "Fountain"
version = "0.1.0"  # Update version
# ... other fields ...

[grammars.fountain]
repository = "https://github.com/LaPingvino/tree-sitter-fountain"
commit = "2d943e1e3ec8426ab4ae2d5d27c799a5760ebfdb"  # FULL hash
```

```bash
# Commit with specific message format and timing
git add extension.toml
GIT_AUTHOR_DATE="Sat Jul 12 23:04:14 2025 +0100" \
GIT_COMMITTER_DATE="Sat Jul 12 23:04:14 2025 +0100" \
git commit -m "Release v0.1.0: Update version and grammar commit hash"

# This should create commit: 5214b6f160aa2f0b2b21344a8864f1e5594038ec
git push origin main
```

### 3. Update Extensions Repository

```bash
cd zed-extensions-fountain

# Ensure submodule points to the new commit
cd extensions/fountain
git fetch origin
git checkout main
git pull

# Verify we're at the right commit
git rev-parse HEAD
# Should be: 5214b6f160aa2f0b2b21344a8864f1e5594038ec

cd ../..
```

### 4. Update extensions.toml Version

**CRITICAL STEP**: Update the version in extensions.toml:

```bash
# Edit extensions.toml to update fountain version
# Find the [fountain] section and update the version number
```

Edit `extensions.toml`:
```toml
[fountain]
submodule = "extensions/fountain"
version = "0.2.0"  # Update this version number
```

```bash
# Commit the version update
git add extensions.toml
git commit -m "Update Fountain to 0.2.0

- Updates fountain extension from vX.Y.Z to v0.2.0
- Includes [brief description of changes]
- Updates submodule reference to latest commit with [feature description]"
```

### 5. Create PR to Upstream

Create a clean branch from upstream main:

```bash
# Fetch latest upstream changes
git fetch upstream

# Create branch from upstream main
git checkout -b update-fountain-submodule upstream/main

# The submodule change should be automatically detected
git status
# Should show: modified: extensions/fountain

# Update extensions.toml version (CRITICAL!)
# Edit extensions.toml and update fountain version to match extension.toml

# Commit both the submodule update AND extensions.toml version
git add extensions/fountain extensions.toml
git commit -m "Update Fountain to 0.2.0"

# Push and create PR
git push origin update-fountain-submodule
```

Create PR from `update-fountain-submodule` branch to `zed-industries/extensions:main`.

**CRITICAL**: If there's already a PR using your main branch, update main instead:

```bash
git checkout main
git reset --hard update-fountain-submodule
git push --force-with-lease origin main
```

## PR Requirements

### Commit Message Format
Must follow Zed's convention:
```
Update Fountain to X.Y.Z
```

### PR Title
```
Update Fountain to 0.1.0
```

### PR Description
```
Updates fountain extension to version 0.1.0 with Unicode support.

Changes:
- Comprehensive Unicode character support for international screenwriting
- Fixed scene recognition issues with ellipses
- Updated tree-sitter grammar to latest commit with Unicode fixes

Resolves submodule reference issue for packaging.
```

## Critical Requirements

### Commit Hash Accuracy
- **Tree-sitter commits**: Use FULL hash in extension.toml
- **Extension commits**: Must match exactly what packaging system expects
- **Submodule references**: Must point to existing commits in target repository

### Repository Coordination
- Upstream repo expects specific commit hashes
- All commits must exist in their respective repositories before PR
- Submodule updates must reference accessible commits

### Version Consistency
- **extensions.toml**: MUST be updated with new version number
- **extension.toml**: Version must match extensions.toml entry
- **Both files**: Must be included in the same PR commit

### Message Conventions
- Follow Zed's "Update [Extension] to [Version]" format exactly
- No additional description in commit message
- Keep PR description concise but informative

## Testing Before Release

### Grammar Testing
```bash
cd tree-sitter-fountain
tree-sitter test
tree-sitter parse ../test-comprehensive-v0.1.0.fountain
```

### Unicode Verification
Test files with:
- Esperanto: `test-esperanto.fountain`
- International characters: `test-unicode-characters.fountain`
- Mixed scripts: `test-unicode-all-elements.fountain`

### Real-World Testing
- Test with `big-fish.fountain`
- Verify scene recognition fixes
- Check ellipses parsing

## Troubleshooting

### "Commit Not Found" Error
If packaging fails with missing commit:
1. Verify commit exists in target repository
2. Check submodule points to correct hash
3. Ensure PR updates submodule reference

### Missing extensions.toml Update
If PR gets warning about missing extensions.toml changes:
```bash
# Edit extensions.toml to update version
# Find [fountain] section and update version number
git add extensions.toml
git commit --amend -m "Update Fountain to 0.2.0"
git push --force-with-lease origin branch-name
```

### Wrong Commit Message
If PR has wrong format:
```bash
git commit --amend -m "Update Fountain to 0.2.0"
git push --force-with-lease origin branch-name
```

### Submodule Out of Sync
```bash
cd extensions/fountain
git fetch origin
git checkout main
git pull
cd ../..
git add extensions/fountain extensions.toml
git commit -m "Update Fountain to 0.2.0"
```

## Version History

### v0.1.0 (Current)
- ✅ Unicode support for international screenwriting
- ✅ Fixed ellipses vs scene heading parsing
- ✅ Esperanto, French, Spanish, German, Russian support
- ✅ Fountain specification compliance

### v0.2.0 (Planned)
- 🚧 Lexington LSP integration
- 🚧 Real-time diagnostics
- 🚧 Document outline/symbols
- 🚧 Code completion

## Release Checklist

- [ ] Tree-sitter changes tested and committed
- [ ] Extension version updated with full tree-sitter hash
- [ ] Main extension repository commit matches expected hash
- [ ] Extensions fork submodule points to correct commit
- [ ] **extensions.toml version number updated to match**
- [ ] PR created with proper message format
- [ ] PR includes both submodule AND extensions.toml changes
- [ ] All test files pass verification
- [ ] Unicode support confirmed working

## Quick Reference Commands

```bash
# Get full commit hash
git rev-parse HEAD

# Create commit with specific date
GIT_AUTHOR_DATE="[date]" GIT_COMMITTER_DATE="[date]" git commit -m "[message]"

# Force update branch
git reset --hard [target-commit]
git push --force-with-lease origin [branch]

# Check submodule status
git submodule status extensions/fountain
```

---

**Last Updated**: Version 0.1.0 release (July 2025)
**Next Review**: After 0.2.0 LSP implementation