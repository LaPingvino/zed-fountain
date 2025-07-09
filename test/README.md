# Fountain Extension Testing

This directory contains test files and utilities for the zed-fountain extension.

## Test Files

### Core Test Files

- **`fountain_syntax_test.fountain`** - Comprehensive test covering all major Fountain syntax elements
- **`edge_cases.fountain`** - Edge cases and potential parsing issues
- **`basic_screenplay.fountain`** - Simple screenplay example from lexington
- **`complex_screenplay.fountain`** - Complex screenplay with advanced features
- **`dual_dialogue.fountain`** - Tests for dual dialogue support

### Test Utilities

- **`test_highlighting.js`** - Node.js script to verify highlighting queries
- **`README.md`** - This file

## Running Tests

### 1. Tree-sitter Grammar Tests

To run the core tree-sitter tests:

```bash
# From the tree-sitter-fountain directory
nix-shell -p tree-sitter --run "tree-sitter test"
```

To update test expectations:

```bash
# From the tree-sitter-fountain directory  
nix-shell -p tree-sitter --run "tree-sitter test --update"
```

### 2. Highlighting Query Tests

To verify that highlighting queries are properly structured:

```bash
# From the zed-fountain directory
node test/test_highlighting.js
```

This will:
- Check that all query files exist
- Verify expected highlighting patterns are present
- Validate basic syntax

### 3. Manual Testing in Zed

1. Install the extension as a dev extension in Zed
2. Open any `.fountain` file from the test directory
3. Verify the following features work:

#### Syntax Highlighting
- **Title page** - Should appear as documentation comments
- **Scene headings** - Should be highlighted as headings
- **Character names** - Should be underlined and typed
- **Dialogue** - Should appear as strings
- **Parentheticals** - Should be italic and dimmed
- **Actions** - Should appear as variables
- **Transitions** - Should be highlighted as todos
- **Notes** `[[...]]` - Should appear as comments
- **Boneyard** `/*...*/` - Should be commented and struck through
- **Synopsis** `=...` - Should appear as constants
- **Sections** `#...` - Should appear as headings

#### Code Folding
Test that the following elements can be folded:
- Sections (`# ACT I`, `## Chapter 1`, etc.)
- Scene blocks
- Dialogue blocks  
- Boneyard comments
- Action blocks

#### Outline/Navigation
The outline panel should show:
- Section headers
- Scene headings
- Synopsis lines
- Dialogue blocks
- Character names

## Test Coverage

### Basic Elements
- [x] Title page
- [x] Scene headings (INT./EXT./EST./I/E.)
- [x] Character names (standard, O.S., V.O., CONT'D)
- [x] Dialogue
- [x] Parentheticals
- [x] Action lines
- [x] Transitions (FADE IN/OUT, CUT TO, etc.)

### Advanced Elements
- [x] Forced elements (! and .)
- [x] Special characters (@COMPUTER, ~SINGING)
- [x] Dual dialogue (^)
- [x] Notes [[...]]
- [x] Boneyard comments /*...*/
- [x] Synopsis lines =...
- [x] Section headings #, ##, ###
- [x] Page breaks ===

### Edge Cases
- [x] Mixed case handling
- [x] Empty lines and spacing
- [x] Special characters in dialogue
- [x] Nested structures
- [x] Ambiguous parsing scenarios
- [x] Long dialogue blocks
- [x] Rapid transitions

## Debugging

### Parser Issues

If you encounter parsing issues:

1. Test with tree-sitter directly:
   ```bash
   nix-shell -p tree-sitter --run "cd tree-sitter-fountain && tree-sitter parse your_file.fountain"
   ```

2. Check for syntax errors in the grammar:
   ```bash
   nix-shell -p tree-sitter --run "cd tree-sitter-fountain && tree-sitter generate"
   ```

### Highlighting Issues

If highlighting doesn't work correctly:

1. Verify query files exist:
   ```bash
   ls languages/fountain/
   # Should show: config.toml, highlights.scm, folds.scm, locals.scm, outline.scm
   ```

2. Check query syntax:
   ```bash
   node test/test_highlighting.js
   ```

3. Update queries from tree-sitter repository:
   ```bash
   node copy-queries.js
   ```

## Adding New Tests

### Tree-sitter Tests

Add new test cases to `tree-sitter-fountain/test/corpus/`:

```
=====
Test Name
=====

fountain content here

---

(expected_tree_structure)
```

### Fountain Test Files

Create new `.fountain` files in this directory focusing on:
- Specific syntax elements
- Edge cases
- Real-world scenarios
- Complex interactions

## Known Issues

- Title page parsing requires specific formatting
- Some edge cases with dual dialogue timing
- Mixed case scene headings may not always parse correctly

## Contributing

When adding new features:

1. Add test cases to `tree-sitter-fountain/test/corpus/`
2. Update highlighting queries if needed
3. Add real-world examples to test files
4. Run all tests to ensure nothing breaks
5. Update this README with new test coverage

## Resources

- [Fountain Specification](https://fountain.io/)
- [Tree-sitter Documentation](https://tree-sitter.github.io/tree-sitter/)
- [Zed Extension Development](https://zed.dev/docs/extensions/developing-extensions)