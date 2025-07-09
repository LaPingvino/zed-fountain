const fs = require('fs');
const path = require('path');

// Test script to verify Fountain highlighting queries work correctly
console.log('🎬 Testing Fountain Highlighting Queries\n');

// Simple test content covering major Fountain elements
const testContent = `Title: Test Script
Author: Test Author

FADE IN:

# ACT I

INT. TEST LOCATION - DAY

Basic action line.

JOHN DOE
Hello, this is dialogue.

JANE SMITH
(whispering)
This has a parenthetical.

NARRATOR (V.O.)
This is voice-over.

[[This is a note]]

/*
This is a boneyard comment.
*/

= This is a synopsis

FADE OUT.

THE END
`;

// Expected highlights for different elements
const expectedHighlights = {
  'title_page': '@comment.documentation',
  'action': '@variable',
  'character': '@markup.underline @type',
  'speech': '@string',
  'parenthetical': '@markup.italic @comment',
  'note': '@comment',
  'boneyard': '@comment @markup.strikethrough',
  'section': '@markup.heading.1 @keyword',
  'scene': '@markup.heading.2 @module.builtin',
  'synopse': '@markup.heading.3 @constant',
  'transition': '@comment.todo'
};

// Read the highlights.scm file
const highlightsPath = path.join(__dirname, '..', 'languages', 'fountain', 'highlights.scm');
const foldsPath = path.join(__dirname, '..', 'languages', 'fountain', 'folds.scm');
const localsPath = path.join(__dirname, '..', 'languages', 'fountain', 'locals.scm');

console.log('📁 Checking query files...');

// Test highlights.scm
if (fs.existsSync(highlightsPath)) {
  const highlightsContent = fs.readFileSync(highlightsPath, 'utf8');
  console.log('✅ highlights.scm exists');

  // Check for expected highlight patterns
  const patterns = [
    '@comment.documentation',
    '@variable',
    '@markup.underline',
    '@string',
    '@markup.italic',
    '@comment',
    '@markup.strikethrough',
    '@markup.heading.1',
    '@markup.heading.2',
    '@markup.heading.3',
    '@comment.todo'
  ];

  patterns.forEach(pattern => {
    if (highlightsContent.includes(pattern)) {
      console.log(`  ✅ Found pattern: ${pattern}`);
    } else {
      console.log(`  ❌ Missing pattern: ${pattern}`);
    }
  });
} else {
  console.log('❌ highlights.scm not found');
}

// Test folds.scm
if (fs.existsSync(foldsPath)) {
  const foldsContent = fs.readFileSync(foldsPath, 'utf8');
  console.log('✅ folds.scm exists');

  // Check for expected fold patterns
  const foldPatterns = [
    '(section)',
    '(scene)',
    '(dialogue)',
    '(dialogue_block)',
    '(boneyard)',
    '(action)',
    '@fold'
  ];

  foldPatterns.forEach(pattern => {
    if (foldsContent.includes(pattern)) {
      console.log(`  ✅ Found fold pattern: ${pattern}`);
    } else {
      console.log(`  ❌ Missing fold pattern: ${pattern}`);
    }
  });
} else {
  console.log('❌ folds.scm not found');
}

// Test locals.scm
if (fs.existsSync(localsPath)) {
  const localsContent = fs.readFileSync(localsPath, 'utf8');
  console.log('✅ locals.scm exists');

  // Check for expected local patterns
  const localPatterns = [
    '@local.scope',
    '@local.definition',
    '(character)'
  ];

  localPatterns.forEach(pattern => {
    if (localsContent.includes(pattern)) {
      console.log(`  ✅ Found local pattern: ${pattern}`);
    } else {
      console.log(`  ❌ Missing local pattern: ${pattern}`);
    }
  });
} else {
  console.log('❌ locals.scm not found');
}

console.log('\n🎯 Query File Analysis Complete');

// Test the structure of different Fountain elements
console.log('\n📝 Testing Fountain Element Recognition:');

const testElements = [
  { name: 'Title Page', content: 'Title: Test\nAuthor: Author', expected: 'title_page' },
  { name: 'Scene Heading', content: 'INT. LOCATION - DAY\n\n', expected: 'scene' },
  { name: 'Character', content: 'JOHN DOE\nHello there.', expected: 'character' },
  { name: 'Action', content: 'He walks to the door.', expected: 'action' },
  { name: 'Transition', content: 'FADE IN:\n\n', expected: 'transition' },
  { name: 'Note', content: '[[This is a note]]', expected: 'note' },
  { name: 'Boneyard', content: '/*\nThis is a comment\n*/', expected: 'boneyard' },
  { name: 'Synopsis', content: '= This is a synopsis', expected: 'synopse' },
  { name: 'Section', content: '# ACT I', expected: 'section' }
];

testElements.forEach(element => {
  console.log(`  📋 ${element.name}: Expected to match '${element.expected}'`);
});

console.log('\n🔍 Highlighting Query Validation:');

// Read and display the actual highlights.scm content
if (fs.existsSync(highlightsPath)) {
  const highlightsContent = fs.readFileSync(highlightsPath, 'utf8');
  console.log('\n📄 Current highlights.scm content:');
  console.log('---');
  console.log(highlightsContent);
  console.log('---');

  // Validate the syntax
  const lines = highlightsContent.split('\n').filter(line => line.trim());
  let syntaxErrors = [];

  lines.forEach((line, index) => {
    // Check for common syntax issues
    if (line.includes('@') && !line.includes('(') && !line.includes(')')) {
      // This might be a standalone highlight without a pattern
      if (!line.match(/^\s*@\w+(\.\w+)*\s*$/)) {
        syntaxErrors.push(`Line ${index + 1}: Possible syntax error in highlight rule`);
      }
    }
  });

  if (syntaxErrors.length === 0) {
    console.log('✅ No obvious syntax errors found in highlights.scm');
  } else {
    console.log('⚠️  Potential syntax issues:');
    syntaxErrors.forEach(error => console.log(`  ${error}`));
  }
}

console.log('\n🧪 Test Summary:');
console.log('- Query files presence: Check above results');
console.log('- Syntax validation: Check above results');
console.log('- To test live highlighting: Open a .fountain file in Zed');
console.log('- To test folding: Try folding sections/scenes in Zed');

console.log('\n🚀 Test complete! Check the results above for any issues.');
