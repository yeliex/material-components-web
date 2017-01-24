const fs = require('fs');
const path = require('path');

const babylon = require('babylon');
const doctrine = require('doctrine');
const t = require('babel-types');
const traverse = require('babel-traverse').default;

const SOURCE_FILE = path.resolve(__dirname, '../../packages/mdc-icon-toggle/adapter.js');
const SOURCE_PKG = require('../../packages/mdc-icon-toggle/package.json');

main();

function main() {
  const source = fs.readFileSync(SOURCE_FILE, 'utf8');
  const ast = babylon.parse(source, {sourceType: 'module'});

  const state = {
    visitingRecord: false,
    recordNode: null,
    recordName: '',
    recordMethods: [],
  };
  traverse(ast, {
    'ExportDefaultDeclaration'({node}) {
      const jsdocInfo = parseJsDoc(node);
      const hasRecordAnnotation = jsdocInfo.tags.some(({title}) => title === 'record');
      if (hasRecordAnnotation) {
        state.visitingRecord = true;
        state.recordNode = node;
        t.assertClassDeclaration(node.declaration);
      }
    },
    'ClassDeclaration'({node}) {
      if (!state.visitingRecord) {
        return;
      }
      state.recordName = node.id.name;
    },
    'ClassMethod'({node}) {
      if (!state.visitingRecord) {
        return;
      }
      state.recordMethods.push(parseRecordMethod(node));
    },
    exit({node}) {
      if (node === state.recordNode) {
        console.log(generateTsInterface(state));
      }
    },
  });
}

function parseRecordMethod(node) {
  t.assertClassMethod(node, {kind: 'method'});
  let name = '';
  if (t.isIdentifier(node.key)) {
    name = node.key.name;
  } else {
    // literal
    name = node.key.value;
  }

  const jsdoc = parseJsDoc(node);
  const args = jsdoc.tags.filter(({title}) => title === 'param').map((tag) => ({
    name: tag.name,
    type: getJsdocType(tag.type),
  }));
  const _returnType = jsdoc.tags.find(({title}) => title === 'return');
  const returnType = _returnType ? getJsdocType(_returnType.type) : null;
  return {
    name,
    args,
    returnType,
  };
}

function getJsdocType(tag) {
  let typeString;
  switch (tag.type) {
    case 'NullableLiteral':
    case 'AllLiteral':
      typeString = 'any';
      break;
    case 'UnionType':
      typeString = tag.elements.map((e) => getJsdocType(e)).join(' | ');
      break;
    case 'RecordType':
      typeString = `{${tag.fields.map(({key, value}) => `${key}: ${getJsdocType(value)}`).join(', ')}}`;
      // typeString += tag.fields.forEach(({key, value}) => {
      //   typeString += ;
      // });
      // typeString += '}';
      break;
    case 'RestType':
      // ew hacky
      name = `...${name}`;
      typeString = getJsdocType(tag.expression);
      break;
    case 'NonNullableType':
      typeString = getJsdocType(tag.expression);
      break;
    case 'OptionalType':
      name += '?';
      typeString = getJsdocType(tag.expression);
      break;
    case 'NullableType':
      typeString = `${tag.expression.name} | null`;
      break;
    case 'NameExpression':
      typeString = tag.name;
      break;
    case 'TypeApplication':
      typeString = `${getJsdocType(tag.expression)}<${tag.applications.map(getJsdocType).join(',')}>`;
      break;
    default:
      throw new Error(`Unsupported type ${tag.type}`);
      break;
  }
  return typeString;
}

function parseJsDoc(node) {
  let docblock = '';
  if (node.leadingComments && node.leadingComments.length) {
    docblock = node.leadingComments.map(({value}) => value).join('\n');
  }
  return doctrine.parse(docblock, {unwrap: true});
}

function generateTsInterface(state) {
  // There has to be a better way to do CodeGen given https://github.com/Microsoft/TypeScript/issues/5595
  // but this is the best I could come up with for now.
  let _indent = 0;
  const sourceLines = [];
  const addLine = (str) => {
    sourceLines.push([`${' '.repeat(_indent * 2)}${str}`]);
  };
  const indent = () => {
    _indent++;
  };
  const outdent = () => {
    _indent--;
    if (_indent < 0) {
      throw new Error('Bad outdent!');
    }
  };

  addLine(`declare module '${SOURCE_PKG.name}' {`);
  indent();
  addLine(`export interface ${state.recordName} {`);
  indent();
  for (const method of state.recordMethods) {
    addLine(genTsMethod(method));
  }
  outdent();
  addLine('}');
  outdent();
  addLine('}');

  return sourceLines.join('\n');
}

function genTsMethod(method) {
  const {name} = method;
  const args = method.args.map(({name, type}) => `${name}: ${type}`).join(', ');
  let methodString = `${name}(${args})`;
  if (method.returnType) {
    methodString += `: ${method.returnType}`;
  }
  methodString += ';';

  return methodString;
}
