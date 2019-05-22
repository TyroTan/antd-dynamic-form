"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireDefault(require("react"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var sortContents = function sortContents(arr) {
  return arr.sort(function (a, b) {
    if (a.container.length === b.container.length) {
      return a.container > b.container;
    }

    return a.container.length < b.container.length;
  });
};

var sortStringKey = function sortStringKey(a, b) {
  if (a.length === b.length) {
    return a > b;
  }

  return a.length < b.length;
};

var Render = function Render(Settings) {
  return _react["default"].createElement(Settings.Form, null, function (ppp) {
    return Settings.data.map(function (field) {
      return _react["default"].createElement(Settings.RenderItem, field);
    });
  });
};

var RenderItem = function RenderItem(item) {
  return _react["default"].createElement("div", null, "default renderItem");
};

var RenderWithTemplate = function RenderWithTemplate(Settings) {
  var templateContents = _toConsumableArray(Settings.templateContents);

  var toRender = sortContents(templateContents).reduce(function (acc, content) {
    var containerKey = content.container;
    var contentsArr = Settings.items.filter(function (item) {
      return item.container === containerKey;
    });

    if (contentsArr.length) {
      if (!content.renderItem || !content.render) {
        var msg = "";

        try {
          msg = " ".concat(JSON.stringify(content));
        } catch (e) {}

        throw Error("Missing render or renderItem.".concat(msg));
      }

      acc[containerKey] = function () {
        return content.render({
          getContents: function getContents() {
            return contentsArr.map(function (item) {
              return content.renderItem(item);
            });
          }
        });
      };

      return acc;
    }

    acc[containerKey] = function () {
      return content.render({
        getContents: function getContents() {
          var r = Object.keys(acc).sort(sortStringKey).filter(function (childKey) {
            return childKey.indexOf(containerKey) === 0 && childKey.length - 1 === containerKey.length;
          }).reduce(function (nodes, currentNode) {
            if (currentNode.indexOf(containerKey) === 0 && currentNode.length - 1 === containerKey.length) {
              nodes = nodes.concat([acc[currentNode]()]);
            }

            return nodes;
          }, []);

          if (!r.length) {
            return _react["default"].createElement(_react["default"].Fragment, null);
          }

          return r;
        }
      });
    };

    return acc;
  }, {});

  if (toRender) {
    return Object.keys(toRender).filter(function (k) {
      return k.length === 1;
    }).sort(sortStringKey).map(function (container) {
      return toRender[container]();
    });
  }

  return _react["default"].createElement(_react["default"].Fragment, null);
};

var DynamicForm = function DynamicForm(props) {
  var Settings = {
    // Form,
    // formInstance: props.form ? props.form : Form.create({}),
    items: props.items,
    RenderItem: props.renderItem ? props.renderItem : RenderItem,
    renderWrapper: props.wrapper ? props.wrapper : function (params) {
      return _react["default"].createElement(Render, Settings);
    },
    templateContents: props.template && props.template.contents && props.template.contents.length ? props.template.contents : []
  };

  if (Settings.templateContents.length) {
    return _react["default"].createElement(_react["default"].Fragment, null, Settings.renderWrapper(_objectSpread({}, Settings, {
      getContents: function getContents(ppp) {
        return _react["default"].createElement(RenderWithTemplate, Settings);
      }
    })));
  }

  return _react["default"].createElement(_react["default"].Fragment, null, Settings.renderWrapper(_objectSpread({}, Settings, {
    getContents: function getContents(ppp) {
      return Settings.items.map(function (field) {
        return _react["default"].createElement(Settings.RenderItem, field);
      });
    }
  })));
};

var _default = DynamicForm;
exports["default"] = _default;
