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
--entry_point $CLOSURE_PKGDIR/mdc-icon-toggle/CLOSURE_TEST \
--js_module_root $CLOSURE_PKGDIR \
--jscomp_off accessControls \
--module_resolution LEGACY \
--js_output_file $CLOSURE_PKGDIR/closure-test.js
"
echo "$CMD"
$CMD

if [ $? -eq 0 ]; then
  echo 'Compilation successful!'
fi

echo "Creating test html harness"
rm -fr $CLOSURE_PKGDIR/index.html
cat >> $CLOSURE_PKGDIR/index.html <<EOF
<!DOCTYPE html>
<html>
  <head>
    <title>Closure Test</title>
  </head>
  <body>
    <i class="mdc-icon-toggle material-icons" role="button" aria-pressed="false"
       aria-label="Add to favorites" tabindex="0"
       data-toggle-on='{"label": "Remove from favorites", "content": "favorite"}'
       data-toggle-off='{"label": "Add to favorites", "content": "favorite_border"}'>
      favorite_border
    </i>
    <script src="closure-test.js"></script>
  </body>
EOF

echo "opening $CLOSURE_PKGDIR/index.html. Open the console when you get there."
sleep 3
open $CLOSURE_PKGDIR/index.html
