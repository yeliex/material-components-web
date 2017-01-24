#!/usr/bin/env sh

set -e

CLOSURE_TMP=.closure-tmp
CLOSURE_PKGDIR=$CLOSURE_TMP/packages
JS_SRCS=$CLOSURE_PKGDIR/**/*.js

echo "Prepping icon toggle for possible JS compilation"

rm -fr $CLOSURE_TMP/**
mkdir -p $CLOSURE_PKGDIR
cp -r packages/{mdc-animation,mdc-icon-toggle,mdc-base,mdc-ripple} $CLOSURE_PKGDIR
rm -fr $CLOSURE_PKGDIR/**/{node_modules,dist}

echo "Rewriting import statements via sed. IRL this would be done using AST transformations"
sed -i '.bak' "s/\'\@material\/\(.*\)\.js\';/\'mdc-\1\.js\';/g" $JS_SRCS
sed -i '.bak2' "s/\'\@material\/\(.*\)\';/\'mdc-\1\/index\';/g" $JS_SRCS

echo "Compiling JS"

CMD="java -jar node_modules/google-closure-compiler/compiler.jar \
--compilation_level ADVANCED \
--js $JS_SRCS \
--language_out ECMASCRIPT5_STRICT \
--dependency_mode STRICT \
--entry_point $CLOSURE_PKGDIR/mdc-icon-toggle/index \
--js_module_root $CLOSURE_PKGDIR \
--jscomp_off accessControls \
--checks_only
"
echo "$CMD"
$CMD

if [ $? -eq 0 ]; then
  echo 'Compilation successful!'
fi
