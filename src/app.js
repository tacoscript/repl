import ASTOutput from './ASTOutput';
import Editor from './Editor';
import ErrorMessage from './ErrorMessage';
import PasteDropTarget from './PasteDropTarget';
import PubSub from 'pubsub-js';
import React from 'react';
import SplitPane from './SplitPane';
// import Toolbar from './Toolbar';
// import TransformOutput from './TransformOutput';
import SettingsDialog from './SettingsDialog';
import ParserSettingsButton from './ParserSettingsButton';
import * as LocalStorage from './LocalStorage';

import getFocusPath from './getFocusPath';
// import {getTransformerByID} from './transformers';
import {getDefaultParser, getDefaultLeftParser/*, getParser*/} from './parsers';
import {getDefaultGenerator, getDefaultLeftGenerator, getGeneratorByID} from './generators';
import defaultCode from './codeExample.txt';
const defaultLeftCode = '# ...generating';

// import SaveForkMixin from './SaveForkMixin';

var App = React.createClass({
  // mixins: [SaveForkMixin],
  getInitialState: function() {
    // TODO: move revision handling code into the SaveForkMixin
    /*
    var snippet = this.props.snippet;
    var revision = this.props.revision;
    if ((snippet && !revision) || (!snippet && revision)) {
      throw Error('Must set both, snippet and revision');
    }
    const initialCode = revision && revision.get('code') || defaultCode;
    const transformerID = revision && revision.get('toolID');
    let transformer = transformerID && getTransformerByID(transformerID);
    const initialTransformCode = revision && revision.get('transform');
    if (initialTransformCode && !transformer) {
      // jscodeshift was the first transformer tool. Instead of updating
      // existing rows in the DB, we do this
      transformer = getTransformerByID('jscodeshift');
    }

    const parser = getParser(
      transformer ? transformer.defaultParser : LocalStorage.getParser()
    ) || getDefaultParser();
    */
    const parser = getDefaultParser();
    const generator = getDefaultGenerator();

    const leftParser = getDefaultLeftParser();
    const leftGenerator = getDefaultLeftGenerator();

    return {
      ast: null,
      astSource: null,
      // transformer,
      focusPath: [],
      leftFocusPath: [],
      // ...this._setCode(initialCode),
      ...this._setCode(defaultCode),
      ...this._setLeftCode(defaultLeftCode),
      // ...this._setTransformCode(initialTransformCode),
      // snippet: snippet,
      // showTransformPanel: !!transformer,
      // revision: revision,
      parser,
      generator,
      leftParser,
      leftGenerator,
      hideAst: true,
    };
  },

  componentDidMount: function() {
    if (this.props.error) {
      this._showError(this.props.error);
    }

    PubSub.subscribe(
      'HIGHLIGHT',
      (_, astNode) => {
        let range = this.state.parser.nodeToRange(astNode);
        if (range) {
          PubSub.publish('CM.HIGHLIGHT', range, this.state.astSource);
        }
      }
    );
    PubSub.subscribe(
      'CLEAR_HIGHLIGHT',
      (_, astNode) => PubSub.publish(
        'CM.CLEAR_HIGHLIGHT',
        astNode && this.state.parser.nodeToRange(astNode)
      )
    );
  },

  componentWillUpdate: function(nextProps, nextState) {
    let err = nextState.editorError;
    if (err && err !== this.state.editorError) {
      console.warn(err.stack ? err.message + '\n' + err.stack : err);
    }
  },

  _setCode(code) {
    return {initialCode: code, currentCode: code};
  },

  _setLeftCode(code) {
    return {initialLeftCode: code, currentLeftCode: code};
  },

  _setGenerator(generatorId) {
    this.setState({
      generator: getGeneratorByID(generatorId)
    });
  },

  _useBabelGenerator() {
    this._setGenerator('babel');
  },

  _useAlPastor() {
    this._setGenerator('alpastor');
  },

  _setTransformCode(transformCode) {
    return {
      initialTransformCode: transformCode,
      currentTransformCode: transformCode,
    };
  },

  parse: function(code, parser) {
    if (!parser) {
      parser = this.state.parser;
    }
    // console.log('Parsing with ' + parser.id);
    return parser.parse(code);
  },

  generate: function(ast, code, generator) {
    if (!generator) {
      generator = this.state.generator;
    }
    // console.log('Generating with ' + generator.id);
    return generator.generate(ast, code);
  },

  onContentChange: function(source, {value: code, cursor, isInternal}) {
    const isLeft = source === 'leftEditor';
    if (isLeft && code === defaultLeftCode) {
      return;
    }
    if (this.state.ast && (this.state[isLeft ? 'currentLeftCode' : 'currentCode'] === code || isInternal)) {
      return;
    }

    const ast = this.parse(code, isLeft ? this.state.leftParser : this.state.parser)
    ast.then(
      ast => this.setState({
        ast: ast,
        astSource: source,
        [isLeft ? 'currentLeftCode' : 'currentCode']: code,
        focusPath: cursor ? getFocusPath(ast, cursor, this.state[isLeft ? 'leftParser' : 'parser']) : [],
        editorError: null,
      }),
      error => this.setState({
        ast: null,
        astSource: null,
        [isLeft ? 'currentLeftCode' : 'currentCode']: code,
        editorError: error,
      })
    )
    ast.then(
      ast => this.generate(ast, code, isLeft ? this.state.generator : this.state.leftGenerator)
    ).then(
      generatedCode => this.setState({
        ...this[isLeft ? '_setCode' : '_setLeftCode'](generatedCode),
        editorError: null,
      }),
      error => this.setState({
        editorError: error,
      })
    );
  },
  /*
  onTransformCodeChange: function({value: transformCode}) {
    this.setState({
      currentTransformCode: transformCode,
    });
  },

  onTransformChange: function(transformer) {
    const showTransformPanel = !this.state.showTransformPanel ||
      transformer !== this.state.transformer;
    const parser =
      showTransformPanel &&
      this.state.parser !== getParser(transformer.defaultParser) ?
      getParser(transformer.defaultParser) :
      this.state.parser;

    var transformCode = this.state.currentTransformCode;
    if (transformer !== this.state.transformer) {
      transformCode = transformer.defaultTransform;
    }

    if (parser !== this.state.parser) {
      this.parse(this.state.currentCode, parser).then(
        ast => this.setState({
          ast,
          parser,
          transformer,
          ...this._setTransformCode(transformCode),
          focusPath: [],
          editorError: null,
          showTransformPanel,
        }),
        error => this.setState({
          ast: null,
          editError: error,
          parser,
          transformer,
          ...this._setTransformCode(transformCode),
          showTransformPanel,
        })
      );
    } else {
      this.setState({
        showTransformPanel,
        parser,
        transformer,
        ...this._setTransformCode(transformCode),
      });
    }
    this._onResize();
  },
  */
  onActivity: function(source, cursorPos) {
    const isLeft = source === 'leftEditor';
    if (this.state.ast) {
      this.setState({
        focusPath: getFocusPath(this.state.ast, cursorPos, this.state[isLeft ? 'leftParser' : 'parser']),
      });
    }
  },

  _showError: function(msg) {
    this.setState({error: msg});
    setTimeout(() => {
      if (msg === this.state.error) {
        this.setState({error: false});
      }
    }, 3000);
  },

  _onResize: function() {
    PubSub.publish('PANEL_RESIZE');
  },

  _onDropText: function(type, event, text) {
    this.parse(text).then(
      ast => this.setState({
        ...this._setCode(text),
        ast: ast,
        focusPath: [],
        editorError: null,
      }),
      error => this.setState({
        ...this._setCode(text),
        ast: null,
        editorError: error,
      })
    );
  },

  _onDropError: function(type, event, msg) {
    this._showError(msg);
  },

  _onParserChange: function(parser) {
    LocalStorage.setParser(parser.id);
    this.parse(this.state.currentCode, parser).then(
      ast => this.setState({
        ast: ast,
        parser: parser,
        focusPath: [],
        editorError: null,
      }),
      error => this.setState({
        ast: null,
        editorError: error,
        parser: parser,
      })
    );
  },

  _onSettingsChange: function() {
    this._onParserChange(this.state.parser);
  },

  _onToggleAst: function() {
    this.setState({hideAst: !this.state.hideAst});
  },

  render: function() {
    /*
    const {
      revision,
      showTransformPanel,
      currentTransformCode,
      initialTransformCode,
    } = this.state;
    const revisionCode = revision && revision.get('code') || defaultCode;

    TODO: move to SaveForkMixin
    const canSave = revisionCode !== this.state.currentCode ||
       showTransformPanel &&
       currentTransformCode !== initialTransformCode &&
       currentTransformCode !== this.state.transformer.defaultTransform;
    */
    return (
      <PasteDropTarget
        className="dropTarget"
        dropindicator={
          <div className="dropIndicator">
            <div>Drop a JavaScript or (JSON-encoded) AST file here</div>
          </div>
        }
        onText={this._onDropText}
        onError={this._onDropError}>
        {/*
        <Toolbar
          forking={this.state.forking}
          saving={this.state.saving}
          onSave={this._onSave}
          onFork={this._onFork}
          onParserChange={this._onParserChange}
          onTransformChange={this.onTransformChange}
          canSave={canSave}
          canFork={!!revision}
          parser={this.state.parser}
          transformer={this.state.transformer}
          transformPanelIsEnabled={this.state.showTransformPanel}
        />
        */}
        {this.state.error || this.state.editorError ? <ErrorMessage message={this.state.error || this.state.editorError.message} /> : null}
        {/*
        <SplitPane
          className="splitpane-content"
          vertical={true}
          onResize={this._onResize}>
          */}
          <SplitPane
            className="splitpane"
            onResize={this._onResize}
            onToggle={this._onToggleAst}>
            <SplitPane
              className="splitpane"
              onResize={this._onResize}
              onToggle={this._onToggleAst}>
                {/*language={this.state.leftParser.language || 'javascript'}*/}
              <Editor
                ref="leftEditor"
                language="coffeescript"
                defaultValue={this.state.initialLeftCode}
                error={this.state.editorError}
                onContentChange={this.onContentChange.bind(this, 'leftEditor')}
                onActivity={this.onActivity.bind(this, 'leftEditor')}
              />
              <div>
                <label>
                  <input type="radio" name="generator" value="babel"
                    onClick={this._useBabelGenerator} checked={this.state.generator.id === 'babel'} />
                  Babel Generator
                </label>
                <label>
                  <input type="radio" name="generator" value="alpastor"
                    onClick={this._useAlPastor} checked={this.state.generator.id === 'alpastor'} />
                  AlPastor Generator
                </label>
                <Editor
                  ref="editor"
                  language={this.state.parser.language || 'javascript'}
                  defaultValue={this.state.initialCode}
                  error={this.state.editorError}
                  onContentChange={this.onContentChange.bind(this, 'editor')}
                  onActivity={this.onActivity.bind(this, 'editor')}
                />
              </div>
            </SplitPane>
            {this.state.hideAst ? null : <ASTOutput
              ast={this.state.ast}
              editorError={this.state.editorError}
              focusPath={this.state.focusPath}
              parser={this.state.parser}
            />}
          </SplitPane>
          {/*
          {this.state.showTransformPanel ? <SplitPane
            className="splitpane"
            onResize={this._onResize}>
            <Editor
              ref="transformEditor"
              highlight={false}
              defaultValue={this.state.initialTransformCode}
              onContentChange={this.onTransformCodeChange}
            />
            <TransformOutput
              transformer={this.state.transformer}
              transformCode={this.state.currentTransformCode}
              code={this.state.currentCode}
            />
          </SplitPane> : null}
        </SplitPane>
        */}
        <ParserSettingsButton parser={this.state.parser} />
        <SettingsDialog
          parser={this.state.parser}
          onChange={this._onSettingsChange}
        />
      </PasteDropTarget>
    );
  },
});

function render(props) {
  React.render(
    <App {...props} />,
    document.getElementById('container')
  );
}
render({});
/*
import Snippet from './Snippet';
Snippet.fetchFromURL().then(
  data => render(data),
  error => render({error: 'Failed to fetch revision: ' + error.message})
);
*/
