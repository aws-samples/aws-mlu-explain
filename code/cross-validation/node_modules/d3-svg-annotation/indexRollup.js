(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.d3 = global.d3 || {})));
}(this, (function (exports) { 'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};











var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();







var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

var get = function get(object, property, receiver) {
  if (object === null) object = Function.prototype;
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent === null) {
      return undefined;
    } else {
      return get(parent, property, receiver);
    }
  } else if ("value" in desc) {
    return desc.value;
  } else {
    var getter = desc.get;

    if (getter === undefined) {
      return undefined;
    }

    return getter.call(receiver);
  }
};

var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};











var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};



















var toConsumableArray = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  } else {
    return Array.from(arr);
  }
};

var Annotation = function () {
  function Annotation(_ref) {
    var _ref$x = _ref.x,
        x = _ref$x === undefined ? 0 : _ref$x,
        _ref$y = _ref.y,
        y = _ref$y === undefined ? 0 : _ref$y,
        nx = _ref.nx,
        ny = _ref.ny,
        _ref$dy = _ref.dy,
        dy = _ref$dy === undefined ? 0 : _ref$dy,
        _ref$dx = _ref.dx,
        dx = _ref$dx === undefined ? 0 : _ref$dx,
        _ref$color = _ref.color,
        color = _ref$color === undefined ? "grey" : _ref$color,
        data = _ref.data,
        type = _ref.type,
        subject = _ref.subject,
        connector = _ref.connector,
        note = _ref.note,
        disable = _ref.disable,
        id = _ref.id,
        className = _ref.className;
    classCallCheck(this, Annotation);

    this._dx = nx !== undefined ? nx - x : dx;
    this._dy = ny !== undefined ? ny - y : dy;
    this._x = x;
    this._y = y;
    this._color = color;
    this.id = id;
    this._className = className || "";

    this._type = type || "";
    this.data = data;

    this.note = note || {};
    this.connector = connector || {};
    this.subject = subject || {};

    this.disable = disable || [];
  }

  createClass(Annotation, [{
    key: "updatePosition",
    value: function updatePosition() {
      if (this.type.setPosition) {
        this.type.setPosition();
        if (this.type.subject && this.type.subject.selectAll(":not(.handle)").nodes().length !== 0) {
          this.type.redrawSubject();
        }
      }
    }
  }, {
    key: "clearComponents",
    value: function clearComponents() {
      this.type.clearComponents && this.type.clearComponents();
    }
  }, {
    key: "updateOffset",
    value: function updateOffset() {
      if (this.type.setOffset) {
        this.type.setOffset();

        if (this.type.connector.selectAll(":not(.handle)").nodes().length !== 0) {
          this.type.redrawConnector();
        }

        this.type.redrawNote();
      }
    }
  }, {
    key: "className",
    get: function get$$1() {
      return this._className;
    },
    set: function set$$1(className) {
      this._className = className;
      if (this.type.setClassName) this.type.setClassName();
    }
  }, {
    key: "type",
    get: function get$$1() {
      return this._type;
    },
    set: function set$$1(type) {
      this._type = type;
      this.clearComponents();
    }
  }, {
    key: "x",
    get: function get$$1() {
      return this._x;
    },
    set: function set$$1(x) {
      this._x = x;
      this.updatePosition();
    }
  }, {
    key: "y",
    get: function get$$1() {
      return this._y;
    },
    set: function set$$1(y) {
      this._y = y;
      this.updatePosition();
    }
  }, {
    key: "color",
    get: function get$$1() {
      return this._color;
    },
    set: function set$$1(color) {
      this._color = color;
      this.updatePosition();
    }
  }, {
    key: "dx",
    get: function get$$1() {
      return this._dx;
    },
    set: function set$$1(dx) {
      this._dx = dx;
      this.updateOffset();
    }
  }, {
    key: "dy",
    get: function get$$1() {
      return this._dy;
    },
    set: function set$$1(dy) {
      this._dy = dy;
      this.updateOffset();
    }
  }, {
    key: "nx",
    set: function set$$1(nx) {
      this._dx = nx - this._x;
      this.updateOffset();
    }
  }, {
    key: "ny",
    set: function set$$1(ny) {
      this._dy = ny - this._y;
      this.updateOffset();
    }
  }, {
    key: "offset",
    get: function get$$1() {
      return { x: this._dx, y: this._dy };
    },
    set: function set$$1(_ref2) {
      var x = _ref2.x,
          y = _ref2.y;

      this._dx = x;
      this._dy = y;
      this.updateOffset();
    }
  }, {
    key: "position",
    get: function get$$1() {
      return { x: this._x, y: this._y };
    },
    set: function set$$1(_ref3) {
      var x = _ref3.x,
          y = _ref3.y;

      this._x = x;
      this._y = y;
      this.updatePosition();
    }
  }, {
    key: "translation",
    get: function get$$1() {
      return {
        x: this._x + this._dx,
        y: this._y + this._dy
      };
    }
  }, {
    key: "json",
    get: function get$$1() {
      var json = {
        x: this._x,
        y: this._y,
        dx: this._dx,
        dy: this._dy
      };

      if (this.data && Object.keys(this.data).length > 0) json.data = this.data;
      if (this.type) json.type = this.type;
      if (this._className) json.className = this._className;

      if (Object.keys(this.connector).length > 0) json.connector = this.connector;
      if (Object.keys(this.subject).length > 0) json.subject = this.subject;
      if (Object.keys(this.note).length > 0) json.note = this.note;

      return json;
    }
  }]);
  return Annotation;
}();

var AnnotationCollection = function () {
  function AnnotationCollection(_ref) {
    var annotations = _ref.annotations,
        accessors = _ref.accessors,
        accessorsInverse = _ref.accessorsInverse;
    classCallCheck(this, AnnotationCollection);

    this.accessors = accessors;
    this.accessorsInverse = accessorsInverse;
    this.annotations = annotations;
  }

  createClass(AnnotationCollection, [{
    key: "clearTypes",
    value: function clearTypes(newSettings) {
      this.annotations.forEach(function (d) {
        d.type = undefined;
        d.subject = newSettings && newSettings.subject || d.subject;
        d.connector = newSettings && newSettings.connector || d.connector;
        d.note = newSettings && newSettings.note || d.note;
      });
    }
  }, {
    key: "setPositionWithAccessors",
    value: function setPositionWithAccessors() {
      var _this = this;

      this.annotations.forEach(function (d) {
        d.type.setPositionWithAccessors(_this.accessors);
      });
    }
  }, {
    key: "editMode",
    value: function editMode(_editMode) {
      this.annotations.forEach(function (a) {
        if (a.type) {
          a.type.editMode = _editMode;
          a.type.updateEditMode();
        }
      });
    }
  }, {
    key: "updateDisable",
    value: function updateDisable(disable) {
      this.annotations.forEach(function (a) {
        a.disable = disable;
        if (a.type) {
          disable.forEach(function (d) {
            if (a.type[d]) {
              a.type[d].remove && a.type[d].remove();
              a.type[d] = undefined;
            }
          });
        }
      });
    }
  }, {
    key: "updateTextWrap",
    value: function updateTextWrap(textWrap) {
      this.annotations.forEach(function (a) {
        if (a.type && a.type.updateTextWrap) {
          a.type.updateTextWrap(textWrap);
        }
      });
    }
  }, {
    key: "updateText",
    value: function updateText() {
      this.annotations.forEach(function (a) {
        if (a.type && a.type.drawText) {
          a.type.drawText();
        }
      });
    }
  }, {
    key: "updateNotePadding",
    value: function updateNotePadding(notePadding) {
      this.annotations.forEach(function (a) {
        if (a.type) {
          a.type.notePadding = notePadding;
        }
      });
    }
  }, {
    key: "json",
    get: function get$$1() {
      var _this2 = this;

      return this.annotations.map(function (a) {
        var json = a.json;
        if (_this2.accessorsInverse && a.data) {
          json.data = {};
          Object.keys(_this2.accessorsInverse).forEach(function (k) {
            json.data[k] = _this2.accessorsInverse[k]({ x: a.x, y: a.y });

            //TODO make this feasible to map back to data for other types of subjects
          });
        }
        return json;
      });
    }
  }, {
    key: "noteNodes",
    get: function get$$1() {
      return this.annotations.map(function (a) {
        return _extends({}, a.type.getNoteBBoxOffset(), { positionX: a.x, positionY: a.y });
      });
    }

    //TODO: come back and rethink if a.x and a.y are applicable in all situations
    // get connectorNodes() {
    //   return this.annotations.map(a => ({ ...a.type.getConnectorBBox(), startX: a.x, startY: a.y}))
    // }

    // get subjectNodes() {
    //   return this.annotations.map(a => ({ ...a.type.getSubjectBBox(), startX: a.x, startY: a.y}))
    // }

    // get annotationNodes() {
    //   return this.annotations.map(a => ({ ...a.type.getAnnotationBBox(), startX: a.x, startY: a.y}))
    // }

  }]);
  return AnnotationCollection;
}();

var xhtml = "http://www.w3.org/1999/xhtml";

var namespaces = {
  svg: "http://www.w3.org/2000/svg",
  xhtml: xhtml,
  xlink: "http://www.w3.org/1999/xlink",
  xml: "http://www.w3.org/XML/1998/namespace",
  xmlns: "http://www.w3.org/2000/xmlns/"
};

var namespace = function (name) {
  var prefix = name += "",
      i = prefix.indexOf(":");
  if (i >= 0 && (prefix = name.slice(0, i)) !== "xmlns") name = name.slice(i + 1);
  return namespaces.hasOwnProperty(prefix) ? { space: namespaces[prefix], local: name } : name;
};

function creatorInherit(name) {
  return function () {
    var document = this.ownerDocument,
        uri = this.namespaceURI;
    return uri === xhtml && document.documentElement.namespaceURI === xhtml ? document.createElement(name) : document.createElementNS(uri, name);
  };
}

function creatorFixed(fullname) {
  return function () {
    return this.ownerDocument.createElementNS(fullname.space, fullname.local);
  };
}

var creator = function (name) {
  var fullname = namespace(name);
  return (fullname.local ? creatorFixed : creatorInherit)(fullname);
};

function none() {}

var selector = function (selector) {
  return selector == null ? none : function () {
    return this.querySelector(selector);
  };
};

var selection_select = function (select) {
  if (typeof select !== "function") select = selector(select);

  for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, subgroup = subgroups[j] = new Array(n), node, subnode, i = 0; i < n; ++i) {
      if ((node = group[i]) && (subnode = select.call(node, node.__data__, i, group))) {
        if ("__data__" in node) subnode.__data__ = node.__data__;
        subgroup[i] = subnode;
      }
    }
  }

  return new Selection(subgroups, this._parents);
};

function empty() {
  return [];
}

var selectorAll = function (selector) {
  return selector == null ? empty : function () {
    return this.querySelectorAll(selector);
  };
};

var selection_selectAll = function (select) {
  if (typeof select !== "function") select = selectorAll(select);

  for (var groups = this._groups, m = groups.length, subgroups = [], parents = [], j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, node, i = 0; i < n; ++i) {
      if (node = group[i]) {
        subgroups.push(select.call(node, node.__data__, i, group));
        parents.push(node);
      }
    }
  }

  return new Selection(subgroups, parents);
};

var matcher = function (selector) {
  return function () {
    return this.matches(selector);
  };
};

var selection_filter = function (match) {
  if (typeof match !== "function") match = matcher(match);

  for (var groups = this._groups, m = groups.length, subgroups = new Array(m), j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, subgroup = subgroups[j] = [], node, i = 0; i < n; ++i) {
      if ((node = group[i]) && match.call(node, node.__data__, i, group)) {
        subgroup.push(node);
      }
    }
  }

  return new Selection(subgroups, this._parents);
};

var sparse = function (update) {
  return new Array(update.length);
};

var selection_enter = function () {
  return new Selection(this._enter || this._groups.map(sparse), this._parents);
};

function EnterNode(parent, datum) {
  this.ownerDocument = parent.ownerDocument;
  this.namespaceURI = parent.namespaceURI;
  this._next = null;
  this._parent = parent;
  this.__data__ = datum;
}

EnterNode.prototype = {
  constructor: EnterNode,
  appendChild: function appendChild(child) {
    return this._parent.insertBefore(child, this._next);
  },
  insertBefore: function insertBefore(child, next) {
    return this._parent.insertBefore(child, next);
  },
  querySelector: function querySelector(selector) {
    return this._parent.querySelector(selector);
  },
  querySelectorAll: function querySelectorAll(selector) {
    return this._parent.querySelectorAll(selector);
  }
};

var constant = function (x) {
  return function () {
    return x;
  };
};

var keyPrefix = "$"; // Protect against keys like “__proto__”.

function bindIndex(parent, group, enter, update, exit, data) {
  var i = 0,
      node,
      groupLength = group.length,
      dataLength = data.length;

  // Put any non-null nodes that fit into update.
  // Put any null nodes into enter.
  // Put any remaining data into enter.
  for (; i < dataLength; ++i) {
    if (node = group[i]) {
      node.__data__ = data[i];
      update[i] = node;
    } else {
      enter[i] = new EnterNode(parent, data[i]);
    }
  }

  // Put any non-null nodes that don’t fit into exit.
  for (; i < groupLength; ++i) {
    if (node = group[i]) {
      exit[i] = node;
    }
  }
}

function bindKey(parent, group, enter, update, exit, data, key) {
  var i,
      node,
      nodeByKeyValue = {},
      groupLength = group.length,
      dataLength = data.length,
      keyValues = new Array(groupLength),
      keyValue;

  // Compute the key for each node.
  // If multiple nodes have the same key, the duplicates are added to exit.
  for (i = 0; i < groupLength; ++i) {
    if (node = group[i]) {
      keyValues[i] = keyValue = keyPrefix + key.call(node, node.__data__, i, group);
      if (keyValue in nodeByKeyValue) {
        exit[i] = node;
      } else {
        nodeByKeyValue[keyValue] = node;
      }
    }
  }

  // Compute the key for each datum.
  // If there a node associated with this key, join and add it to update.
  // If there is not (or the key is a duplicate), add it to enter.
  for (i = 0; i < dataLength; ++i) {
    keyValue = keyPrefix + key.call(parent, data[i], i, data);
    if (node = nodeByKeyValue[keyValue]) {
      update[i] = node;
      node.__data__ = data[i];
      nodeByKeyValue[keyValue] = null;
    } else {
      enter[i] = new EnterNode(parent, data[i]);
    }
  }

  // Add any remaining nodes that were not bound to data to exit.
  for (i = 0; i < groupLength; ++i) {
    if ((node = group[i]) && nodeByKeyValue[keyValues[i]] === node) {
      exit[i] = node;
    }
  }
}

var selection_data = function (value, key) {
  if (!value) {
    data = new Array(this.size()), j = -1;
    this.each(function (d) {
      data[++j] = d;
    });
    return data;
  }

  var bind = key ? bindKey : bindIndex,
      parents = this._parents,
      groups = this._groups;

  if (typeof value !== "function") value = constant(value);

  for (var m = groups.length, update = new Array(m), enter = new Array(m), exit = new Array(m), j = 0; j < m; ++j) {
    var parent = parents[j],
        group = groups[j],
        groupLength = group.length,
        data = value.call(parent, parent && parent.__data__, j, parents),
        dataLength = data.length,
        enterGroup = enter[j] = new Array(dataLength),
        updateGroup = update[j] = new Array(dataLength),
        exitGroup = exit[j] = new Array(groupLength);

    bind(parent, group, enterGroup, updateGroup, exitGroup, data, key);

    // Now connect the enter nodes to their following update node, such that
    // appendChild can insert the materialized enter node before this node,
    // rather than at the end of the parent node.
    for (var i0 = 0, i1 = 0, previous, next; i0 < dataLength; ++i0) {
      if (previous = enterGroup[i0]) {
        if (i0 >= i1) i1 = i0 + 1;
        while (!(next = updateGroup[i1]) && ++i1 < dataLength) {}
        previous._next = next || null;
      }
    }
  }

  update = new Selection(update, parents);
  update._enter = enter;
  update._exit = exit;
  return update;
};

var selection_exit = function () {
  return new Selection(this._exit || this._groups.map(sparse), this._parents);
};

var selection_join = function (onenter, onupdate, onexit) {
  var enter = this.enter(),
      update = this,
      exit = this.exit();
  enter = typeof onenter === "function" ? onenter(enter) : enter.append(onenter + "");
  if (onupdate != null) update = onupdate(update);
  if (onexit == null) exit.remove();else onexit(exit);
  return enter && update ? enter.merge(update).order() : update;
};

var selection_merge = function (selection) {

  for (var groups0 = this._groups, groups1 = selection._groups, m0 = groups0.length, m1 = groups1.length, m = Math.min(m0, m1), merges = new Array(m0), j = 0; j < m; ++j) {
    for (var group0 = groups0[j], group1 = groups1[j], n = group0.length, merge = merges[j] = new Array(n), node, i = 0; i < n; ++i) {
      if (node = group0[i] || group1[i]) {
        merge[i] = node;
      }
    }
  }

  for (; j < m0; ++j) {
    merges[j] = groups0[j];
  }

  return new Selection(merges, this._parents);
};

var selection_order = function () {

  for (var groups = this._groups, j = -1, m = groups.length; ++j < m;) {
    for (var group = groups[j], i = group.length - 1, next = group[i], node; --i >= 0;) {
      if (node = group[i]) {
        if (next && node.compareDocumentPosition(next) ^ 4) next.parentNode.insertBefore(node, next);
        next = node;
      }
    }
  }

  return this;
};

var selection_sort = function (compare) {
  if (!compare) compare = ascending;

  function compareNode(a, b) {
    return a && b ? compare(a.__data__, b.__data__) : !a - !b;
  }

  for (var groups = this._groups, m = groups.length, sortgroups = new Array(m), j = 0; j < m; ++j) {
    for (var group = groups[j], n = group.length, sortgroup = sortgroups[j] = new Array(n), node, i = 0; i < n; ++i) {
      if (node = group[i]) {
        sortgroup[i] = node;
      }
    }
    sortgroup.sort(compareNode);
  }

  return new Selection(sortgroups, this._parents).order();
};

function ascending(a, b) {
  return a < b ? -1 : a > b ? 1 : a >= b ? 0 : NaN;
}

var selection_call = function () {
  var callback = arguments[0];
  arguments[0] = this;
  callback.apply(null, arguments);
  return this;
};

var selection_nodes = function () {
  var nodes = new Array(this.size()),
      i = -1;
  this.each(function () {
    nodes[++i] = this;
  });
  return nodes;
};

var selection_node = function () {

  for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) {
    for (var group = groups[j], i = 0, n = group.length; i < n; ++i) {
      var node = group[i];
      if (node) return node;
    }
  }

  return null;
};

var selection_size = function () {
  var size = 0;
  this.each(function () {
    ++size;
  });
  return size;
};

var selection_empty = function () {
  return !this.node();
};

var selection_each = function (callback) {

  for (var groups = this._groups, j = 0, m = groups.length; j < m; ++j) {
    for (var group = groups[j], i = 0, n = group.length, node; i < n; ++i) {
      if (node = group[i]) callback.call(node, node.__data__, i, group);
    }
  }

  return this;
};

function attrRemove(name) {
  return function () {
    this.removeAttribute(name);
  };
}

function attrRemoveNS(fullname) {
  return function () {
    this.removeAttributeNS(fullname.space, fullname.local);
  };
}

function attrConstant(name, value) {
  return function () {
    this.setAttribute(name, value);
  };
}

function attrConstantNS(fullname, value) {
  return function () {
    this.setAttributeNS(fullname.space, fullname.local, value);
  };
}

function attrFunction(name, value) {
  return function () {
    var v = value.apply(this, arguments);
    if (v == null) this.removeAttribute(name);else this.setAttribute(name, v);
  };
}

function attrFunctionNS(fullname, value) {
  return function () {
    var v = value.apply(this, arguments);
    if (v == null) this.removeAttributeNS(fullname.space, fullname.local);else this.setAttributeNS(fullname.space, fullname.local, v);
  };
}

var selection_attr = function (name, value) {
  var fullname = namespace(name);

  if (arguments.length < 2) {
    var node = this.node();
    return fullname.local ? node.getAttributeNS(fullname.space, fullname.local) : node.getAttribute(fullname);
  }

  return this.each((value == null ? fullname.local ? attrRemoveNS : attrRemove : typeof value === "function" ? fullname.local ? attrFunctionNS : attrFunction : fullname.local ? attrConstantNS : attrConstant)(fullname, value));
};

var defaultView = function (node) {
    return node.ownerDocument && node.ownerDocument.defaultView || // node is a Node
    node.document && node // node is a Window
    || node.defaultView; // node is a Document
};

function styleRemove(name) {
  return function () {
    this.style.removeProperty(name);
  };
}

function styleConstant(name, value, priority) {
  return function () {
    this.style.setProperty(name, value, priority);
  };
}

function styleFunction(name, value, priority) {
  return function () {
    var v = value.apply(this, arguments);
    if (v == null) this.style.removeProperty(name);else this.style.setProperty(name, v, priority);
  };
}

var selection_style = function (name, value, priority) {
  return arguments.length > 1 ? this.each((value == null ? styleRemove : typeof value === "function" ? styleFunction : styleConstant)(name, value, priority == null ? "" : priority)) : styleValue(this.node(), name);
};

function styleValue(node, name) {
  return node.style.getPropertyValue(name) || defaultView(node).getComputedStyle(node, null).getPropertyValue(name);
}

function propertyRemove(name) {
  return function () {
    delete this[name];
  };
}

function propertyConstant(name, value) {
  return function () {
    this[name] = value;
  };
}

function propertyFunction(name, value) {
  return function () {
    var v = value.apply(this, arguments);
    if (v == null) delete this[name];else this[name] = v;
  };
}

var selection_property = function (name, value) {
  return arguments.length > 1 ? this.each((value == null ? propertyRemove : typeof value === "function" ? propertyFunction : propertyConstant)(name, value)) : this.node()[name];
};

function classArray(string) {
  return string.trim().split(/^|\s+/);
}

function classList(node) {
  return node.classList || new ClassList(node);
}

function ClassList(node) {
  this._node = node;
  this._names = classArray(node.getAttribute("class") || "");
}

ClassList.prototype = {
  add: function add(name) {
    var i = this._names.indexOf(name);
    if (i < 0) {
      this._names.push(name);
      this._node.setAttribute("class", this._names.join(" "));
    }
  },
  remove: function remove(name) {
    var i = this._names.indexOf(name);
    if (i >= 0) {
      this._names.splice(i, 1);
      this._node.setAttribute("class", this._names.join(" "));
    }
  },
  contains: function contains(name) {
    return this._names.indexOf(name) >= 0;
  }
};

function classedAdd(node, names) {
  var list = classList(node),
      i = -1,
      n = names.length;
  while (++i < n) {
    list.add(names[i]);
  }
}

function classedRemove(node, names) {
  var list = classList(node),
      i = -1,
      n = names.length;
  while (++i < n) {
    list.remove(names[i]);
  }
}

function classedTrue(names) {
  return function () {
    classedAdd(this, names);
  };
}

function classedFalse(names) {
  return function () {
    classedRemove(this, names);
  };
}

function classedFunction(names, value) {
  return function () {
    (value.apply(this, arguments) ? classedAdd : classedRemove)(this, names);
  };
}

var selection_classed = function (name, value) {
  var names = classArray(name + "");

  if (arguments.length < 2) {
    var list = classList(this.node()),
        i = -1,
        n = names.length;
    while (++i < n) {
      if (!list.contains(names[i])) return false;
    }return true;
  }

  return this.each((typeof value === "function" ? classedFunction : value ? classedTrue : classedFalse)(names, value));
};

function textRemove() {
  this.textContent = "";
}

function textConstant(value) {
  return function () {
    this.textContent = value;
  };
}

function textFunction(value) {
  return function () {
    var v = value.apply(this, arguments);
    this.textContent = v == null ? "" : v;
  };
}

var selection_text = function (value) {
  return arguments.length ? this.each(value == null ? textRemove : (typeof value === "function" ? textFunction : textConstant)(value)) : this.node().textContent;
};

function htmlRemove() {
  this.innerHTML = "";
}

function htmlConstant(value) {
  return function () {
    this.innerHTML = value;
  };
}

function htmlFunction(value) {
  return function () {
    var v = value.apply(this, arguments);
    this.innerHTML = v == null ? "" : v;
  };
}

var selection_html = function (value) {
  return arguments.length ? this.each(value == null ? htmlRemove : (typeof value === "function" ? htmlFunction : htmlConstant)(value)) : this.node().innerHTML;
};

function raise() {
  if (this.nextSibling) this.parentNode.appendChild(this);
}

var selection_raise = function () {
  return this.each(raise);
};

function lower() {
  if (this.previousSibling) this.parentNode.insertBefore(this, this.parentNode.firstChild);
}

var selection_lower = function () {
  return this.each(lower);
};

var selection_append = function (name) {
  var create = typeof name === "function" ? name : creator(name);
  return this.select(function () {
    return this.appendChild(create.apply(this, arguments));
  });
};

function constantNull() {
  return null;
}

var selection_insert = function (name, before) {
  var create = typeof name === "function" ? name : creator(name),
      select = before == null ? constantNull : typeof before === "function" ? before : selector(before);
  return this.select(function () {
    return this.insertBefore(create.apply(this, arguments), select.apply(this, arguments) || null);
  });
};

function remove() {
  var parent = this.parentNode;
  if (parent) parent.removeChild(this);
}

var selection_remove = function () {
  return this.each(remove);
};

function selection_cloneShallow() {
  return this.parentNode.insertBefore(this.cloneNode(false), this.nextSibling);
}

function selection_cloneDeep() {
  return this.parentNode.insertBefore(this.cloneNode(true), this.nextSibling);
}

var selection_clone = function (deep) {
  return this.select(deep ? selection_cloneDeep : selection_cloneShallow);
};

var selection_datum = function (value) {
    return arguments.length ? this.property("__data__", value) : this.node().__data__;
};

var filterEvents = {};

var event = null;

if (typeof document !== "undefined") {
  var element = document.documentElement;
  if (!("onmouseenter" in element)) {
    filterEvents = { mouseenter: "mouseover", mouseleave: "mouseout" };
  }
}

function filterContextListener(listener, index, group) {
  listener = contextListener(listener, index, group);
  return function (event) {
    var related = event.relatedTarget;
    if (!related || related !== this && !(related.compareDocumentPosition(this) & 8)) {
      listener.call(this, event);
    }
  };
}

function contextListener(listener, index, group) {
  return function (event1) {
    var event0 = event; // Events can be reentrant (e.g., focus).
    event = event1;
    try {
      listener.call(this, this.__data__, index, group);
    } finally {
      event = event0;
    }
  };
}

function parseTypenames(typenames) {
  return typenames.trim().split(/^|\s+/).map(function (t) {
    var name = "",
        i = t.indexOf(".");
    if (i >= 0) name = t.slice(i + 1), t = t.slice(0, i);
    return { type: t, name: name };
  });
}

function onRemove(typename) {
  return function () {
    var on = this.__on;
    if (!on) return;
    for (var j = 0, i = -1, m = on.length, o; j < m; ++j) {
      if (o = on[j], (!typename.type || o.type === typename.type) && o.name === typename.name) {
        this.removeEventListener(o.type, o.listener, o.capture);
      } else {
        on[++i] = o;
      }
    }
    if (++i) on.length = i;else delete this.__on;
  };
}

function onAdd(typename, value, capture) {
  var wrap = filterEvents.hasOwnProperty(typename.type) ? filterContextListener : contextListener;
  return function (d, i, group) {
    var on = this.__on,
        o,
        listener = wrap(value, i, group);
    if (on) for (var j = 0, m = on.length; j < m; ++j) {
      if ((o = on[j]).type === typename.type && o.name === typename.name) {
        this.removeEventListener(o.type, o.listener, o.capture);
        this.addEventListener(o.type, o.listener = listener, o.capture = capture);
        o.value = value;
        return;
      }
    }
    this.addEventListener(typename.type, listener, capture);
    o = { type: typename.type, name: typename.name, value: value, listener: listener, capture: capture };
    if (!on) this.__on = [o];else on.push(o);
  };
}

var selection_on = function (typename, value, capture) {
  var typenames = parseTypenames(typename + ""),
      i,
      n = typenames.length,
      t;

  if (arguments.length < 2) {
    var on = this.node().__on;
    if (on) for (var j = 0, m = on.length, o; j < m; ++j) {
      for (i = 0, o = on[j]; i < n; ++i) {
        if ((t = typenames[i]).type === o.type && t.name === o.name) {
          return o.value;
        }
      }
    }
    return;
  }

  on = value ? onAdd : onRemove;
  if (capture == null) capture = false;
  for (i = 0; i < n; ++i) {
    this.each(on(typenames[i], value, capture));
  }return this;
};

function customEvent(event1, listener, that, args) {
  var event0 = event;
  event1.sourceEvent = event;
  event = event1;
  try {
    return listener.apply(that, args);
  } finally {
    event = event0;
  }
}

function dispatchEvent(node, type, params) {
  var window = defaultView(node),
      event = window.CustomEvent;

  if (typeof event === "function") {
    event = new event(type, params);
  } else {
    event = window.document.createEvent("Event");
    if (params) event.initEvent(type, params.bubbles, params.cancelable), event.detail = params.detail;else event.initEvent(type, false, false);
  }

  node.dispatchEvent(event);
}

function dispatchConstant(type, params) {
  return function () {
    return dispatchEvent(this, type, params);
  };
}

function dispatchFunction(type, params) {
  return function () {
    return dispatchEvent(this, type, params.apply(this, arguments));
  };
}

var selection_dispatch = function (type, params) {
  return this.each((typeof params === "function" ? dispatchFunction : dispatchConstant)(type, params));
};

var root = [null];

function Selection(groups, parents) {
  this._groups = groups;
  this._parents = parents;
}

function selection() {
  return new Selection([[document.documentElement]], root);
}

Selection.prototype = selection.prototype = {
  constructor: Selection,
  select: selection_select,
  selectAll: selection_selectAll,
  filter: selection_filter,
  data: selection_data,
  enter: selection_enter,
  exit: selection_exit,
  join: selection_join,
  merge: selection_merge,
  order: selection_order,
  sort: selection_sort,
  call: selection_call,
  nodes: selection_nodes,
  node: selection_node,
  size: selection_size,
  empty: selection_empty,
  each: selection_each,
  attr: selection_attr,
  style: selection_style,
  property: selection_property,
  classed: selection_classed,
  text: selection_text,
  html: selection_html,
  raise: selection_raise,
  lower: selection_lower,
  append: selection_append,
  insert: selection_insert,
  remove: selection_remove,
  clone: selection_clone,
  datum: selection_datum,
  on: selection_on,
  dispatch: selection_dispatch
};

var select = function (selector) {
    return typeof selector === "string" ? new Selection([[document.querySelector(selector)]], [document.documentElement]) : new Selection([[selector]], root);
};

var sourceEvent = function () {
  var current = event,
      source;
  while (source = current.sourceEvent) {
    current = source;
  }return current;
};

var point = function (node, event) {
  var svg = node.ownerSVGElement || node;

  if (svg.createSVGPoint) {
    var point = svg.createSVGPoint();
    point.x = event.clientX, point.y = event.clientY;
    point = point.matrixTransform(node.getScreenCTM().inverse());
    return [point.x, point.y];
  }

  var rect = node.getBoundingClientRect();
  return [event.clientX - rect.left - node.clientLeft, event.clientY - rect.top - node.clientTop];
};

var mouse = function (node) {
  var event = sourceEvent();
  if (event.changedTouches) event = event.changedTouches[0];
  return point(node, event);
};

var touch = function (node, touches, identifier) {
  if (arguments.length < 3) identifier = touches, touches = sourceEvent().changedTouches;

  for (var i = 0, n = touches ? touches.length : 0, touch; i < n; ++i) {
    if ((touch = touches[i]).identifier === identifier) {
      return point(node, touch);
    }
  }

  return null;
};

var noop = { value: function value() {} };

function dispatch() {
  for (var i = 0, n = arguments.length, _ = {}, t; i < n; ++i) {
    if (!(t = arguments[i] + "") || t in _) throw new Error("illegal type: " + t);
    _[t] = [];
  }
  return new Dispatch(_);
}

function Dispatch(_) {
  this._ = _;
}

function parseTypenames$1(typenames, types) {
  return typenames.trim().split(/^|\s+/).map(function (t) {
    var name = "",
        i = t.indexOf(".");
    if (i >= 0) name = t.slice(i + 1), t = t.slice(0, i);
    if (t && !types.hasOwnProperty(t)) throw new Error("unknown type: " + t);
    return { type: t, name: name };
  });
}

Dispatch.prototype = dispatch.prototype = {
  constructor: Dispatch,
  on: function on(typename, callback) {
    var _ = this._,
        T = parseTypenames$1(typename + "", _),
        t,
        i = -1,
        n = T.length;

    // If no callback was specified, return the callback of the given type and name.
    if (arguments.length < 2) {
      while (++i < n) {
        if ((t = (typename = T[i]).type) && (t = get$1(_[t], typename.name))) return t;
      }return;
    }

    // If a type was specified, set the callback for the given type and name.
    // Otherwise, if a null callback was specified, remove callbacks of the given name.
    if (callback != null && typeof callback !== "function") throw new Error("invalid callback: " + callback);
    while (++i < n) {
      if (t = (typename = T[i]).type) _[t] = set$1(_[t], typename.name, callback);else if (callback == null) for (t in _) {
        _[t] = set$1(_[t], typename.name, null);
      }
    }

    return this;
  },
  copy: function copy() {
    var copy = {},
        _ = this._;
    for (var t in _) {
      copy[t] = _[t].slice();
    }return new Dispatch(copy);
  },
  call: function call(type, that) {
    if ((n = arguments.length - 2) > 0) for (var args = new Array(n), i = 0, n, t; i < n; ++i) {
      args[i] = arguments[i + 2];
    }if (!this._.hasOwnProperty(type)) throw new Error("unknown type: " + type);
    for (t = this._[type], i = 0, n = t.length; i < n; ++i) {
      t[i].value.apply(that, args);
    }
  },
  apply: function apply(type, that, args) {
    if (!this._.hasOwnProperty(type)) throw new Error("unknown type: " + type);
    for (var t = this._[type], i = 0, n = t.length; i < n; ++i) {
      t[i].value.apply(that, args);
    }
  }
};

function get$1(type, name) {
  for (var i = 0, n = type.length, c; i < n; ++i) {
    if ((c = type[i]).name === name) {
      return c.value;
    }
  }
}

function set$1(type, name, callback) {
  for (var i = 0, n = type.length; i < n; ++i) {
    if (type[i].name === name) {
      type[i] = noop, type = type.slice(0, i).concat(type.slice(i + 1));
      break;
    }
  }
  if (callback != null) type.push({ name: name, value: callback });
  return type;
}

function nopropagation() {
  event.stopImmediatePropagation();
}

var noevent = function () {
  event.preventDefault();
  event.stopImmediatePropagation();
};

var nodrag = function (view) {
  var root = view.document.documentElement,
      selection$$1 = select(view).on("dragstart.drag", noevent, true);
  if ("onselectstart" in root) {
    selection$$1.on("selectstart.drag", noevent, true);
  } else {
    root.__noselect = root.style.MozUserSelect;
    root.style.MozUserSelect = "none";
  }
};

function yesdrag(view, noclick) {
  var root = view.document.documentElement,
      selection$$1 = select(view).on("dragstart.drag", null);
  if (noclick) {
    selection$$1.on("click.drag", noevent, true);
    setTimeout(function () {
      selection$$1.on("click.drag", null);
    }, 0);
  }
  if ("onselectstart" in root) {
    selection$$1.on("selectstart.drag", null);
  } else {
    root.style.MozUserSelect = root.__noselect;
    delete root.__noselect;
  }
}

var constant$1 = function (x) {
  return function () {
    return x;
  };
};

function DragEvent(target, type, subject, id, active, x, y, dx, dy, dispatch) {
  this.target = target;
  this.type = type;
  this.subject = subject;
  this.identifier = id;
  this.active = active;
  this.x = x;
  this.y = y;
  this.dx = dx;
  this.dy = dy;
  this._ = dispatch;
}

DragEvent.prototype.on = function () {
  var value = this._.on.apply(this._, arguments);
  return value === this._ ? this : value;
};

// Ignore right-click, since that should open the context menu.
function defaultFilter() {
  return !event.button;
}

function defaultContainer() {
  return this.parentNode;
}

function defaultSubject(d) {
  return d == null ? { x: event.x, y: event.y } : d;
}

function defaultTouchable() {
  return "ontouchstart" in this;
}

var drag = function () {
  var filter = defaultFilter,
      container = defaultContainer,
      subject = defaultSubject,
      touchable = defaultTouchable,
      gestures = {},
      listeners = dispatch("start", "drag", "end"),
      active = 0,
      mousedownx,
      mousedowny,
      mousemoving,
      touchending,
      clickDistance2 = 0;

  function drag(selection$$1) {
    selection$$1.on("mousedown.drag", mousedowned).filter(touchable).on("touchstart.drag", touchstarted).on("touchmove.drag", touchmoved).on("touchend.drag touchcancel.drag", touchended).style("touch-action", "none").style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
  }

  function mousedowned() {
    if (touchending || !filter.apply(this, arguments)) return;
    var gesture = beforestart("mouse", container.apply(this, arguments), mouse, this, arguments);
    if (!gesture) return;
    select(event.view).on("mousemove.drag", mousemoved, true).on("mouseup.drag", mouseupped, true);
    nodrag(event.view);
    nopropagation();
    mousemoving = false;
    mousedownx = event.clientX;
    mousedowny = event.clientY;
    gesture("start");
  }

  function mousemoved() {
    noevent();
    if (!mousemoving) {
      var dx = event.clientX - mousedownx,
          dy = event.clientY - mousedowny;
      mousemoving = dx * dx + dy * dy > clickDistance2;
    }
    gestures.mouse("drag");
  }

  function mouseupped() {
    select(event.view).on("mousemove.drag mouseup.drag", null);
    yesdrag(event.view, mousemoving);
    noevent();
    gestures.mouse("end");
  }

  function touchstarted() {
    if (!filter.apply(this, arguments)) return;
    var touches$$1 = event.changedTouches,
        c = container.apply(this, arguments),
        n = touches$$1.length,
        i,
        gesture;

    for (i = 0; i < n; ++i) {
      if (gesture = beforestart(touches$$1[i].identifier, c, touch, this, arguments)) {
        nopropagation();
        gesture("start");
      }
    }
  }

  function touchmoved() {
    var touches$$1 = event.changedTouches,
        n = touches$$1.length,
        i,
        gesture;

    for (i = 0; i < n; ++i) {
      if (gesture = gestures[touches$$1[i].identifier]) {
        noevent();
        gesture("drag");
      }
    }
  }

  function touchended() {
    var touches$$1 = event.changedTouches,
        n = touches$$1.length,
        i,
        gesture;

    if (touchending) clearTimeout(touchending);
    touchending = setTimeout(function () {
      touchending = null;
    }, 500); // Ghost clicks are delayed!
    for (i = 0; i < n; ++i) {
      if (gesture = gestures[touches$$1[i].identifier]) {
        nopropagation();
        gesture("end");
      }
    }
  }

  function beforestart(id, container, point, that, args) {
    var p = point(container, id),
        s,
        dx,
        dy,
        sublisteners = listeners.copy();

    if (!customEvent(new DragEvent(drag, "beforestart", s, id, active, p[0], p[1], 0, 0, sublisteners), function () {
      if ((event.subject = s = subject.apply(that, args)) == null) return false;
      dx = s.x - p[0] || 0;
      dy = s.y - p[1] || 0;
      return true;
    })) return;

    return function gesture(type) {
      var p0 = p,
          n;
      switch (type) {
        case "start":
          gestures[id] = gesture, n = active++;break;
        case "end":
          delete gestures[id], --active; // nobreak
        case "drag":
          p = point(container, id), n = active;break;
      }
      customEvent(new DragEvent(drag, type, s, id, n, p[0] + dx, p[1] + dy, p[0] - p0[0], p[1] - p0[1], sublisteners), sublisteners.apply, sublisteners, [type, that, args]);
    };
  }

  drag.filter = function (_) {
    return arguments.length ? (filter = typeof _ === "function" ? _ : constant$1(!!_), drag) : filter;
  };

  drag.container = function (_) {
    return arguments.length ? (container = typeof _ === "function" ? _ : constant$1(_), drag) : container;
  };

  drag.subject = function (_) {
    return arguments.length ? (subject = typeof _ === "function" ? _ : constant$1(_), drag) : subject;
  };

  drag.touchable = function (_) {
    return arguments.length ? (touchable = typeof _ === "function" ? _ : constant$1(!!_), drag) : touchable;
  };

  drag.on = function () {
    var value = listeners.on.apply(listeners, arguments);
    return value === listeners ? drag : value;
  };

  drag.clickDistance = function (_) {
    return arguments.length ? (clickDistance2 = (_ = +_) * _, drag) : Math.sqrt(clickDistance2);
  };

  return drag;
};

var pointHandle = function pointHandle(_ref) {
  var _ref$cx = _ref.cx,
      cx = _ref$cx === undefined ? 0 : _ref$cx,
      _ref$cy = _ref.cy,
      cy = _ref$cy === undefined ? 0 : _ref$cy;

  return { move: { x: cx, y: cy } };
};

var circleHandles = function circleHandles(_ref2) {
  var _ref2$cx = _ref2.cx,
      cx = _ref2$cx === undefined ? 0 : _ref2$cx,
      _ref2$cy = _ref2.cy,
      cy = _ref2$cy === undefined ? 0 : _ref2$cy,
      r1 = _ref2.r1,
      r2 = _ref2.r2,
      padding = _ref2.padding;

  var h = { move: { x: cx, y: cy } };

  if (r1 !== undefined) {
    h.r1 = { x: cx + r1 / Math.sqrt(2), y: cy + r1 / Math.sqrt(2) };
  }

  if (r2 !== undefined) {
    h.r2 = { x: cx + r2 / Math.sqrt(2), y: cy + r2 / Math.sqrt(2) };
  }

  if (padding !== undefined) {
    h.padding = { x: cx + r1 + padding, y: cy };
  }

  return h;
};





//arc handles
var addHandles = function addHandles(_ref5) {
  var group = _ref5.group,
      handles = _ref5.handles,
      _ref5$r = _ref5.r,
      r = _ref5$r === undefined ? 10 : _ref5$r;

  //give it a group and x,y to draw handles
  //then give it instructions on what the handles change
  var h = group.selectAll("circle.handle").data(handles);

  h.enter().append("circle").attr("class", "handle").attr("fill", "grey").attr("fill-opacity", 0.1).attr("cursor", "move").attr("stroke-dasharray", 5).attr("stroke", "grey").call(drag().container(select("g.annotations").node()).on("start", function (d) {
    return d.start && d.start(d);
  }).on("drag", function (d) {
    return d.drag && d.drag(d);
  }).on("end", function (d) {
    return d.end && d.end(d);
  }));

  group.selectAll("circle.handle").attr("cx", function (d) {
    return d.x;
  }).attr("cy", function (d) {
    return d.y;
  }).attr("r", function (d) {
    return d.r || r;
  }).attr("class", function (d) {
    return "handle " + (d.className || "");
  });

  h.exit().remove();
};

var leftRightDynamic = function leftRightDynamic(align, y) {
  if (align === "dynamic" || align === "left" || align === "right") {
    if (y < 0) {
      align = "top";
    } else {
      align = "bottom";
    }
  }
  return align;
};

var topBottomDynamic = function topBottomDynamic(align, x) {
  if (align === "dynamic" || align === "top" || align === "bottom") {
    if (x < 0) {
      align = "right";
    } else {
      align = "left";
    }
  }
  return align;
};

var orientationTopBottom = ["topBottom", "top", "bottom"];
var orientationLeftRight = ["leftRight", "left", "right"];

var noteAlignment = (function (_ref) {
  var _ref$padding = _ref.padding,
      padding = _ref$padding === undefined ? 0 : _ref$padding,
      _ref$bbox = _ref.bbox,
      bbox = _ref$bbox === undefined ? { x: 0, y: 0, width: 0, height: 0 } : _ref$bbox,
      align = _ref.align,
      orientation = _ref.orientation,
      _ref$offset = _ref.offset,
      offset = _ref$offset === undefined ? { x: 0, y: 0 } : _ref$offset;

  var x = -bbox.x;
  var y = 0; //-bbox.y
  if (orientationTopBottom.indexOf(orientation) !== -1) {
    align = topBottomDynamic(align, offset.x);
    if (offset.y < 0 && orientation === "topBottom" || orientation === "top") {
      y -= bbox.height + padding;
    } else {
      y += padding;
    }

    if (align === "middle") {
      x -= bbox.width / 2;
    } else if (align === "right") {
      x -= bbox.width;
    }
  } else if (orientationLeftRight.indexOf(orientation) !== -1) {
    align = leftRightDynamic(align, offset.y);
    if (offset.x < 0 && orientation === "leftRight" || orientation === "left") {
      x -= bbox.width + padding;
    } else {
      x += padding;
    }

    if (align === "middle") {
      y -= bbox.height / 2;
    } else if (align === "top") {
      y -= bbox.height;
    }
  }

  return { x: x, y: y };
});

var pi = Math.PI;
var tau = 2 * pi;
var epsilon = 1e-6;
var tauEpsilon = tau - epsilon;

function Path() {
  this._x0 = this._y0 = // start of current subpath
  this._x1 = this._y1 = null; // end of current subpath
  this._ = "";
}

function path() {
  return new Path();
}

Path.prototype = path.prototype = {
  constructor: Path,
  moveTo: function moveTo(x, y) {
    this._ += "M" + (this._x0 = this._x1 = +x) + "," + (this._y0 = this._y1 = +y);
  },
  closePath: function closePath() {
    if (this._x1 !== null) {
      this._x1 = this._x0, this._y1 = this._y0;
      this._ += "Z";
    }
  },
  lineTo: function lineTo(x, y) {
    this._ += "L" + (this._x1 = +x) + "," + (this._y1 = +y);
  },
  quadraticCurveTo: function quadraticCurveTo(x1, y1, x, y) {
    this._ += "Q" + +x1 + "," + +y1 + "," + (this._x1 = +x) + "," + (this._y1 = +y);
  },
  bezierCurveTo: function bezierCurveTo(x1, y1, x2, y2, x, y) {
    this._ += "C" + +x1 + "," + +y1 + "," + +x2 + "," + +y2 + "," + (this._x1 = +x) + "," + (this._y1 = +y);
  },
  arcTo: function arcTo(x1, y1, x2, y2, r) {
    x1 = +x1, y1 = +y1, x2 = +x2, y2 = +y2, r = +r;
    var x0 = this._x1,
        y0 = this._y1,
        x21 = x2 - x1,
        y21 = y2 - y1,
        x01 = x0 - x1,
        y01 = y0 - y1,
        l01_2 = x01 * x01 + y01 * y01;

    // Is the radius negative? Error.
    if (r < 0) throw new Error("negative radius: " + r);

    // Is this path empty? Move to (x1,y1).
    if (this._x1 === null) {
      this._ += "M" + (this._x1 = x1) + "," + (this._y1 = y1);
    }

    // Or, is (x1,y1) coincident with (x0,y0)? Do nothing.
    else if (!(l01_2 > epsilon)) ;

      // Or, are (x0,y0), (x1,y1) and (x2,y2) collinear?
      // Equivalently, is (x1,y1) coincident with (x2,y2)?
      // Or, is the radius zero? Line to (x1,y1).
      else if (!(Math.abs(y01 * x21 - y21 * x01) > epsilon) || !r) {
          this._ += "L" + (this._x1 = x1) + "," + (this._y1 = y1);
        }

        // Otherwise, draw an arc!
        else {
            var x20 = x2 - x0,
                y20 = y2 - y0,
                l21_2 = x21 * x21 + y21 * y21,
                l20_2 = x20 * x20 + y20 * y20,
                l21 = Math.sqrt(l21_2),
                l01 = Math.sqrt(l01_2),
                l = r * Math.tan((pi - Math.acos((l21_2 + l01_2 - l20_2) / (2 * l21 * l01))) / 2),
                t01 = l / l01,
                t21 = l / l21;

            // If the start tangent is not coincident with (x0,y0), line to.
            if (Math.abs(t01 - 1) > epsilon) {
              this._ += "L" + (x1 + t01 * x01) + "," + (y1 + t01 * y01);
            }

            this._ += "A" + r + "," + r + ",0,0," + +(y01 * x20 > x01 * y20) + "," + (this._x1 = x1 + t21 * x21) + "," + (this._y1 = y1 + t21 * y21);
          }
  },
  arc: function arc(x, y, r, a0, a1, ccw) {
    x = +x, y = +y, r = +r;
    var dx = r * Math.cos(a0),
        dy = r * Math.sin(a0),
        x0 = x + dx,
        y0 = y + dy,
        cw = 1 ^ ccw,
        da = ccw ? a0 - a1 : a1 - a0;

    // Is the radius negative? Error.
    if (r < 0) throw new Error("negative radius: " + r);

    // Is this path empty? Move to (x0,y0).
    if (this._x1 === null) {
      this._ += "M" + x0 + "," + y0;
    }

    // Or, is (x0,y0) not coincident with the previous point? Line to (x0,y0).
    else if (Math.abs(this._x1 - x0) > epsilon || Math.abs(this._y1 - y0) > epsilon) {
        this._ += "L" + x0 + "," + y0;
      }

    // Is this arc empty? We’re done.
    if (!r) return;

    // Does the angle go the wrong way? Flip the direction.
    if (da < 0) da = da % tau + tau;

    // Is this a complete circle? Draw two arcs to complete the circle.
    if (da > tauEpsilon) {
      this._ += "A" + r + "," + r + ",0,1," + cw + "," + (x - dx) + "," + (y - dy) + "A" + r + "," + r + ",0,1," + cw + "," + (this._x1 = x0) + "," + (this._y1 = y0);
    }

    // Is this arc non-empty? Draw an arc!
    else if (da > epsilon) {
        this._ += "A" + r + "," + r + ",0," + +(da >= pi) + "," + cw + "," + (this._x1 = x + r * Math.cos(a1)) + "," + (this._y1 = y + r * Math.sin(a1));
      }
  },
  rect: function rect(x, y, w, h) {
    this._ += "M" + (this._x0 = this._x1 = +x) + "," + (this._y0 = this._y1 = +y) + "h" + +w + "v" + +h + "h" + -w + "Z";
  },
  toString: function toString() {
    return this._;
  }
};

var constant$2 = function (x) {
  return function constant() {
    return x;
  };
};

var epsilon$1 = 1e-12;
var pi$1 = Math.PI;
var halfPi = pi$1 / 2;
var tau$1 = 2 * pi$1;

function arcInnerRadius(d) {
  return d.innerRadius;
}

function arcOuterRadius(d) {
  return d.outerRadius;
}

function arcStartAngle(d) {
  return d.startAngle;
}

function arcEndAngle(d) {
  return d.endAngle;
}

function arcPadAngle(d) {
  return d && d.padAngle; // Note: optional!
}

function asin(x) {
  return x >= 1 ? halfPi : x <= -1 ? -halfPi : Math.asin(x);
}

function intersect(x0, y0, x1, y1, x2, y2, x3, y3) {
  var x10 = x1 - x0,
      y10 = y1 - y0,
      x32 = x3 - x2,
      y32 = y3 - y2,
      t = (x32 * (y0 - y2) - y32 * (x0 - x2)) / (y32 * x10 - x32 * y10);
  return [x0 + t * x10, y0 + t * y10];
}

// Compute perpendicular offset line of length rc.
// http://mathworld.wolfram.com/Circle-LineIntersection.html
function cornerTangents(x0, y0, x1, y1, r1, rc, cw) {
  var x01 = x0 - x1,
      y01 = y0 - y1,
      lo = (cw ? rc : -rc) / Math.sqrt(x01 * x01 + y01 * y01),
      ox = lo * y01,
      oy = -lo * x01,
      x11 = x0 + ox,
      y11 = y0 + oy,
      x10 = x1 + ox,
      y10 = y1 + oy,
      x00 = (x11 + x10) / 2,
      y00 = (y11 + y10) / 2,
      dx = x10 - x11,
      dy = y10 - y11,
      d2 = dx * dx + dy * dy,
      r = r1 - rc,
      D = x11 * y10 - x10 * y11,
      d = (dy < 0 ? -1 : 1) * Math.sqrt(Math.max(0, r * r * d2 - D * D)),
      cx0 = (D * dy - dx * d) / d2,
      cy0 = (-D * dx - dy * d) / d2,
      cx1 = (D * dy + dx * d) / d2,
      cy1 = (-D * dx + dy * d) / d2,
      dx0 = cx0 - x00,
      dy0 = cy0 - y00,
      dx1 = cx1 - x00,
      dy1 = cy1 - y00;

  // Pick the closer of the two intersection points.
  // TODO Is there a faster way to determine which intersection to use?
  if (dx0 * dx0 + dy0 * dy0 > dx1 * dx1 + dy1 * dy1) cx0 = cx1, cy0 = cy1;

  return {
    cx: cx0,
    cy: cy0,
    x01: -ox,
    y01: -oy,
    x11: cx0 * (r1 / r - 1),
    y11: cy0 * (r1 / r - 1)
  };
}

var arc = function () {
  var innerRadius = arcInnerRadius,
      outerRadius = arcOuterRadius,
      cornerRadius = constant$2(0),
      padRadius = null,
      startAngle = arcStartAngle,
      endAngle = arcEndAngle,
      padAngle = arcPadAngle,
      context = null;

  function arc() {
    var buffer,
        r,
        r0 = +innerRadius.apply(this, arguments),
        r1 = +outerRadius.apply(this, arguments),
        a0 = startAngle.apply(this, arguments) - halfPi,
        a1 = endAngle.apply(this, arguments) - halfPi,
        da = Math.abs(a1 - a0),
        cw = a1 > a0;

    if (!context) context = buffer = path();

    // Ensure that the outer radius is always larger than the inner radius.
    if (r1 < r0) r = r1, r1 = r0, r0 = r;

    // Is it a point?
    if (!(r1 > epsilon$1)) context.moveTo(0, 0);

    // Or is it a circle or annulus?
    else if (da > tau$1 - epsilon$1) {
        context.moveTo(r1 * Math.cos(a0), r1 * Math.sin(a0));
        context.arc(0, 0, r1, a0, a1, !cw);
        if (r0 > epsilon$1) {
          context.moveTo(r0 * Math.cos(a1), r0 * Math.sin(a1));
          context.arc(0, 0, r0, a1, a0, cw);
        }
      }

      // Or is it a circular or annular sector?
      else {
          var a01 = a0,
              a11 = a1,
              a00 = a0,
              a10 = a1,
              da0 = da,
              da1 = da,
              ap = padAngle.apply(this, arguments) / 2,
              rp = ap > epsilon$1 && (padRadius ? +padRadius.apply(this, arguments) : Math.sqrt(r0 * r0 + r1 * r1)),
              rc = Math.min(Math.abs(r1 - r0) / 2, +cornerRadius.apply(this, arguments)),
              rc0 = rc,
              rc1 = rc,
              t0,
              t1;

          // Apply padding? Note that since r1 ≥ r0, da1 ≥ da0.
          if (rp > epsilon$1) {
            var p0 = asin(rp / r0 * Math.sin(ap)),
                p1 = asin(rp / r1 * Math.sin(ap));
            if ((da0 -= p0 * 2) > epsilon$1) p0 *= cw ? 1 : -1, a00 += p0, a10 -= p0;else da0 = 0, a00 = a10 = (a0 + a1) / 2;
            if ((da1 -= p1 * 2) > epsilon$1) p1 *= cw ? 1 : -1, a01 += p1, a11 -= p1;else da1 = 0, a01 = a11 = (a0 + a1) / 2;
          }

          var x01 = r1 * Math.cos(a01),
              y01 = r1 * Math.sin(a01),
              x10 = r0 * Math.cos(a10),
              y10 = r0 * Math.sin(a10);

          // Apply rounded corners?
          if (rc > epsilon$1) {
            var x11 = r1 * Math.cos(a11),
                y11 = r1 * Math.sin(a11),
                x00 = r0 * Math.cos(a00),
                y00 = r0 * Math.sin(a00);

            // Restrict the corner radius according to the sector angle.
            if (da < pi$1) {
              var oc = da0 > epsilon$1 ? intersect(x01, y01, x00, y00, x11, y11, x10, y10) : [x10, y10],
                  ax = x01 - oc[0],
                  ay = y01 - oc[1],
                  bx = x11 - oc[0],
                  by = y11 - oc[1],
                  kc = 1 / Math.sin(Math.acos((ax * bx + ay * by) / (Math.sqrt(ax * ax + ay * ay) * Math.sqrt(bx * bx + by * by))) / 2),
                  lc = Math.sqrt(oc[0] * oc[0] + oc[1] * oc[1]);
              rc0 = Math.min(rc, (r0 - lc) / (kc - 1));
              rc1 = Math.min(rc, (r1 - lc) / (kc + 1));
            }
          }

          // Is the sector collapsed to a line?
          if (!(da1 > epsilon$1)) context.moveTo(x01, y01);

          // Does the sector’s outer ring have rounded corners?
          else if (rc1 > epsilon$1) {
              t0 = cornerTangents(x00, y00, x01, y01, r1, rc1, cw);
              t1 = cornerTangents(x11, y11, x10, y10, r1, rc1, cw);

              context.moveTo(t0.cx + t0.x01, t0.cy + t0.y01);

              // Have the corners merged?
              if (rc1 < rc) context.arc(t0.cx, t0.cy, rc1, Math.atan2(t0.y01, t0.x01), Math.atan2(t1.y01, t1.x01), !cw);

              // Otherwise, draw the two corners and the ring.
              else {
                  context.arc(t0.cx, t0.cy, rc1, Math.atan2(t0.y01, t0.x01), Math.atan2(t0.y11, t0.x11), !cw);
                  context.arc(0, 0, r1, Math.atan2(t0.cy + t0.y11, t0.cx + t0.x11), Math.atan2(t1.cy + t1.y11, t1.cx + t1.x11), !cw);
                  context.arc(t1.cx, t1.cy, rc1, Math.atan2(t1.y11, t1.x11), Math.atan2(t1.y01, t1.x01), !cw);
                }
            }

            // Or is the outer ring just a circular arc?
            else context.moveTo(x01, y01), context.arc(0, 0, r1, a01, a11, !cw);

          // Is there no inner ring, and it’s a circular sector?
          // Or perhaps it’s an annular sector collapsed due to padding?
          if (!(r0 > epsilon$1) || !(da0 > epsilon$1)) context.lineTo(x10, y10);

          // Does the sector’s inner ring (or point) have rounded corners?
          else if (rc0 > epsilon$1) {
              t0 = cornerTangents(x10, y10, x11, y11, r0, -rc0, cw);
              t1 = cornerTangents(x01, y01, x00, y00, r0, -rc0, cw);

              context.lineTo(t0.cx + t0.x01, t0.cy + t0.y01);

              // Have the corners merged?
              if (rc0 < rc) context.arc(t0.cx, t0.cy, rc0, Math.atan2(t0.y01, t0.x01), Math.atan2(t1.y01, t1.x01), !cw);

              // Otherwise, draw the two corners and the ring.
              else {
                  context.arc(t0.cx, t0.cy, rc0, Math.atan2(t0.y01, t0.x01), Math.atan2(t0.y11, t0.x11), !cw);
                  context.arc(0, 0, r0, Math.atan2(t0.cy + t0.y11, t0.cx + t0.x11), Math.atan2(t1.cy + t1.y11, t1.cx + t1.x11), cw);
                  context.arc(t1.cx, t1.cy, rc0, Math.atan2(t1.y11, t1.x11), Math.atan2(t1.y01, t1.x01), !cw);
                }
            }

            // Or is the inner ring just a circular arc?
            else context.arc(0, 0, r0, a10, a00, cw);
        }

    context.closePath();

    if (buffer) return context = null, buffer + "" || null;
  }

  arc.centroid = function () {
    var r = (+innerRadius.apply(this, arguments) + +outerRadius.apply(this, arguments)) / 2,
        a = (+startAngle.apply(this, arguments) + +endAngle.apply(this, arguments)) / 2 - pi$1 / 2;
    return [Math.cos(a) * r, Math.sin(a) * r];
  };

  arc.innerRadius = function (_) {
    return arguments.length ? (innerRadius = typeof _ === "function" ? _ : constant$2(+_), arc) : innerRadius;
  };

  arc.outerRadius = function (_) {
    return arguments.length ? (outerRadius = typeof _ === "function" ? _ : constant$2(+_), arc) : outerRadius;
  };

  arc.cornerRadius = function (_) {
    return arguments.length ? (cornerRadius = typeof _ === "function" ? _ : constant$2(+_), arc) : cornerRadius;
  };

  arc.padRadius = function (_) {
    return arguments.length ? (padRadius = _ == null ? null : typeof _ === "function" ? _ : constant$2(+_), arc) : padRadius;
  };

  arc.startAngle = function (_) {
    return arguments.length ? (startAngle = typeof _ === "function" ? _ : constant$2(+_), arc) : startAngle;
  };

  arc.endAngle = function (_) {
    return arguments.length ? (endAngle = typeof _ === "function" ? _ : constant$2(+_), arc) : endAngle;
  };

  arc.padAngle = function (_) {
    return arguments.length ? (padAngle = typeof _ === "function" ? _ : constant$2(+_), arc) : padAngle;
  };

  arc.context = function (_) {
    return arguments.length ? (context = _ == null ? null : _, arc) : context;
  };

  return arc;
};

function Linear(context) {
  this._context = context;
}

Linear.prototype = {
  areaStart: function areaStart() {
    this._line = 0;
  },
  areaEnd: function areaEnd() {
    this._line = NaN;
  },
  lineStart: function lineStart() {
    this._point = 0;
  },
  lineEnd: function lineEnd() {
    if (this._line || this._line !== 0 && this._point === 1) this._context.closePath();
    this._line = 1 - this._line;
  },
  point: function point(x, y) {
    x = +x, y = +y;
    switch (this._point) {
      case 0:
        this._point = 1;this._line ? this._context.lineTo(x, y) : this._context.moveTo(x, y);break;
      case 1:
        this._point = 2; // proceed
      default:
        this._context.lineTo(x, y);break;
    }
  }
};

var curveLinear = function (context) {
  return new Linear(context);
};

function x(p) {
  return p[0];
}

function y(p) {
  return p[1];
}

var line = function () {
  var x$$1 = x,
      y$$1 = y,
      defined = constant$2(true),
      context = null,
      curve = curveLinear,
      output = null;

  function line(data) {
    var i,
        n = data.length,
        d,
        defined0 = false,
        buffer;

    if (context == null) output = curve(buffer = path());

    for (i = 0; i <= n; ++i) {
      if (!(i < n && defined(d = data[i], i, data)) === defined0) {
        if (defined0 = !defined0) output.lineStart();else output.lineEnd();
      }
      if (defined0) output.point(+x$$1(d, i, data), +y$$1(d, i, data));
    }

    if (buffer) return output = null, buffer + "" || null;
  }

  line.x = function (_) {
    return arguments.length ? (x$$1 = typeof _ === "function" ? _ : constant$2(+_), line) : x$$1;
  };

  line.y = function (_) {
    return arguments.length ? (y$$1 = typeof _ === "function" ? _ : constant$2(+_), line) : y$$1;
  };

  line.defined = function (_) {
    return arguments.length ? (defined = typeof _ === "function" ? _ : constant$2(!!_), line) : defined;
  };

  line.curve = function (_) {
    return arguments.length ? (curve = _, context != null && (output = curve(context)), line) : curve;
  };

  line.context = function (_) {
    return arguments.length ? (_ == null ? context = output = null : output = curve(context = _), line) : context;
  };

  return line;
};

function _point$1(that, x, y) {
  that._context.bezierCurveTo(that._x1 + that._k * (that._x2 - that._x0), that._y1 + that._k * (that._y2 - that._y0), that._x2 + that._k * (that._x1 - x), that._y2 + that._k * (that._y1 - y), that._x2, that._y2);
}

function Cardinal(context, tension) {
  this._context = context;
  this._k = (1 - tension) / 6;
}

Cardinal.prototype = {
  areaStart: function areaStart() {
    this._line = 0;
  },
  areaEnd: function areaEnd() {
    this._line = NaN;
  },
  lineStart: function lineStart() {
    this._x0 = this._x1 = this._x2 = this._y0 = this._y1 = this._y2 = NaN;
    this._point = 0;
  },
  lineEnd: function lineEnd() {
    switch (this._point) {
      case 2:
        this._context.lineTo(this._x2, this._y2);break;
      case 3:
        _point$1(this, this._x1, this._y1);break;
    }
    if (this._line || this._line !== 0 && this._point === 1) this._context.closePath();
    this._line = 1 - this._line;
  },
  point: function point(x, y) {
    x = +x, y = +y;
    switch (this._point) {
      case 0:
        this._point = 1;this._line ? this._context.lineTo(x, y) : this._context.moveTo(x, y);break;
      case 1:
        this._point = 2;this._x1 = x, this._y1 = y;break;
      case 2:
        this._point = 3; // proceed
      default:
        _point$1(this, x, y);break;
    }
    this._x0 = this._x1, this._x1 = this._x2, this._x2 = x;
    this._y0 = this._y1, this._y1 = this._y2, this._y2 = y;
  }
};

function _point$2(that, x, y) {
  var x1 = that._x1,
      y1 = that._y1,
      x2 = that._x2,
      y2 = that._y2;

  if (that._l01_a > epsilon$1) {
    var a = 2 * that._l01_2a + 3 * that._l01_a * that._l12_a + that._l12_2a,
        n = 3 * that._l01_a * (that._l01_a + that._l12_a);
    x1 = (x1 * a - that._x0 * that._l12_2a + that._x2 * that._l01_2a) / n;
    y1 = (y1 * a - that._y0 * that._l12_2a + that._y2 * that._l01_2a) / n;
  }

  if (that._l23_a > epsilon$1) {
    var b = 2 * that._l23_2a + 3 * that._l23_a * that._l12_a + that._l12_2a,
        m = 3 * that._l23_a * (that._l23_a + that._l12_a);
    x2 = (x2 * b + that._x1 * that._l23_2a - x * that._l12_2a) / m;
    y2 = (y2 * b + that._y1 * that._l23_2a - y * that._l12_2a) / m;
  }

  that._context.bezierCurveTo(x1, y1, x2, y2, that._x2, that._y2);
}

function CatmullRom(context, alpha) {
  this._context = context;
  this._alpha = alpha;
}

CatmullRom.prototype = {
  areaStart: function areaStart() {
    this._line = 0;
  },
  areaEnd: function areaEnd() {
    this._line = NaN;
  },
  lineStart: function lineStart() {
    this._x0 = this._x1 = this._x2 = this._y0 = this._y1 = this._y2 = NaN;
    this._l01_a = this._l12_a = this._l23_a = this._l01_2a = this._l12_2a = this._l23_2a = this._point = 0;
  },
  lineEnd: function lineEnd() {
    switch (this._point) {
      case 2:
        this._context.lineTo(this._x2, this._y2);break;
      case 3:
        this.point(this._x2, this._y2);break;
    }
    if (this._line || this._line !== 0 && this._point === 1) this._context.closePath();
    this._line = 1 - this._line;
  },
  point: function point$$1(x, y) {
    x = +x, y = +y;

    if (this._point) {
      var x23 = this._x2 - x,
          y23 = this._y2 - y;
      this._l23_a = Math.sqrt(this._l23_2a = Math.pow(x23 * x23 + y23 * y23, this._alpha));
    }

    switch (this._point) {
      case 0:
        this._point = 1;this._line ? this._context.lineTo(x, y) : this._context.moveTo(x, y);break;
      case 1:
        this._point = 2;break;
      case 2:
        this._point = 3; // proceed
      default:
        _point$2(this, x, y);break;
    }

    this._l01_a = this._l12_a, this._l12_a = this._l23_a;
    this._l01_2a = this._l12_2a, this._l12_2a = this._l23_2a;
    this._x0 = this._x1, this._x1 = this._x2, this._x2 = x;
    this._y0 = this._y1, this._y1 = this._y2, this._y2 = y;
  }
};

var curveCatmullRom = ((function custom(alpha) {

  function catmullRom(context) {
    return alpha ? new CatmullRom(context, alpha) : new Cardinal(context, 0);
  }

  catmullRom.alpha = function (alpha) {
    return custom(+alpha);
  };

  return catmullRom;
}))(0.5);

function sign(x) {
  return x < 0 ? -1 : 1;
}

// Calculate the slopes of the tangents (Hermite-type interpolation) based on
// the following paper: Steffen, M. 1990. A Simple Method for Monotonic
// Interpolation in One Dimension. Astronomy and Astrophysics, Vol. 239, NO.
// NOV(II), P. 443, 1990.
function slope3(that, x2, y2) {
  var h0 = that._x1 - that._x0,
      h1 = x2 - that._x1,
      s0 = (that._y1 - that._y0) / (h0 || h1 < 0 && -0),
      s1 = (y2 - that._y1) / (h1 || h0 < 0 && -0),
      p = (s0 * h1 + s1 * h0) / (h0 + h1);
  return (sign(s0) + sign(s1)) * Math.min(Math.abs(s0), Math.abs(s1), 0.5 * Math.abs(p)) || 0;
}

// Calculate a one-sided slope.
function slope2(that, t) {
  var h = that._x1 - that._x0;
  return h ? (3 * (that._y1 - that._y0) / h - t) / 2 : t;
}

// According to https://en.wikipedia.org/wiki/Cubic_Hermite_spline#Representations
// "you can express cubic Hermite interpolation in terms of cubic Bézier curves
// with respect to the four values p0, p0 + m0 / 3, p1 - m1 / 3, p1".
function _point$3(that, t0, t1) {
  var x0 = that._x0,
      y0 = that._y0,
      x1 = that._x1,
      y1 = that._y1,
      dx = (x1 - x0) / 3;
  that._context.bezierCurveTo(x0 + dx, y0 + dx * t0, x1 - dx, y1 - dx * t1, x1, y1);
}

function MonotoneX(context) {
  this._context = context;
}

MonotoneX.prototype = {
  areaStart: function areaStart() {
    this._line = 0;
  },
  areaEnd: function areaEnd() {
    this._line = NaN;
  },
  lineStart: function lineStart() {
    this._x0 = this._x1 = this._y0 = this._y1 = this._t0 = NaN;
    this._point = 0;
  },
  lineEnd: function lineEnd() {
    switch (this._point) {
      case 2:
        this._context.lineTo(this._x1, this._y1);break;
      case 3:
        _point$3(this, this._t0, slope2(this, this._t0));break;
    }
    if (this._line || this._line !== 0 && this._point === 1) this._context.closePath();
    this._line = 1 - this._line;
  },
  point: function point(x, y) {
    var t1 = NaN;

    x = +x, y = +y;
    if (x === this._x1 && y === this._y1) return; // Ignore coincident points.
    switch (this._point) {
      case 0:
        this._point = 1;this._line ? this._context.lineTo(x, y) : this._context.moveTo(x, y);break;
      case 1:
        this._point = 2;break;
      case 2:
        this._point = 3;_point$3(this, slope2(this, t1 = slope3(this, x, y)), t1);break;
      default:
        _point$3(this, this._t0, t1 = slope3(this, x, y));break;
    }

    this._x0 = this._x1, this._x1 = x;
    this._y0 = this._y1, this._y1 = y;
    this._t0 = t1;
  }
};

function MonotoneY(context) {
  this._context = new ReflectContext(context);
}

(MonotoneY.prototype = Object.create(MonotoneX.prototype)).point = function (x, y) {
  MonotoneX.prototype.point.call(this, y, x);
};

function ReflectContext(context) {
  this._context = context;
}

ReflectContext.prototype = {
  moveTo: function moveTo(x, y) {
    this._context.moveTo(y, x);
  },
  closePath: function closePath() {
    this._context.closePath();
  },
  lineTo: function lineTo(x, y) {
    this._context.lineTo(y, x);
  },
  bezierCurveTo: function bezierCurveTo(x1, y1, x2, y2, x, y) {
    this._context.bezierCurveTo(y1, x1, y2, x2, y, x);
  }
};

var lineBuilder = function lineBuilder(_ref) {
  var data = _ref.data,
      _ref$curve = _ref.curve,
      curve = _ref$curve === undefined ? curveLinear : _ref$curve,
      canvasContext = _ref.canvasContext,
      className = _ref.className,
      classID = _ref.classID;

  var lineGen = line().curve(curve);

  var builder = {
    type: 'path',
    className: className,
    classID: classID,
    data: data
  };

  if (canvasContext) {
    lineGen.context(canvasContext);
    builder.pathMethods = lineGen;
  } else {
    builder.attrs = {
      d: lineGen(data)
    };
  }

  return builder;
};

var arcBuilder = function arcBuilder(_ref2) {
  var data = _ref2.data,
      canvasContext = _ref2.canvasContext,
      className = _ref2.className,
      classID = _ref2.classID;


  var builder = {
    type: 'path',
    className: className,
    classID: classID,
    data: data
  };

  var arcShape = arc().innerRadius(data.innerRadius || 0).outerRadius(data.outerRadius || data.radius || 2).startAngle(data.startAngle || 0).endAngle(data.endAngle || 2 * Math.PI);

  if (canvasContext) {
    arcShape.context(canvasContext);
    builder.pathMethods = lineGen;
  } else {

    builder.attrs = {
      d: arcShape()
    };
  }

  return builder;
};

var noteVertical = (function (_ref) {
  var align = _ref.align,
      _ref$x = _ref.x,
      x = _ref$x === undefined ? 0 : _ref$x,
      _ref$y = _ref.y,
      y = _ref$y === undefined ? 0 : _ref$y,
      bbox = _ref.bbox,
      offset = _ref.offset;

  align = leftRightDynamic(align, offset.y);

  if (align === "top") {
    y -= bbox.height;
  } else if (align === "middle") {
    y -= bbox.height / 2;
  }

  var data = [[x, y], [x, y + bbox.height]];
  return { components: [lineBuilder({ data: data, className: "note-line" })] };
});

var noteHorizontal = (function (_ref) {
  var align = _ref.align,
      _ref$x = _ref.x,
      x = _ref$x === undefined ? 0 : _ref$x,
      _ref$y = _ref.y,
      y = _ref$y === undefined ? 0 : _ref$y,
      offset = _ref.offset,
      bbox = _ref.bbox;

  align = topBottomDynamic(align, offset.x);

  if (align === "right") {
    x -= bbox.width;
  } else if (align === "middle") {
    x -= bbox.width / 2;
  }

  var data = [[x, y], [x + bbox.width, y]];
  return { components: [lineBuilder({ data: data, className: "note-line" })] };
});

var lineSetup = function lineSetup(_ref) {
  var type = _ref.type,
      subjectType = _ref.subjectType;

  var annotation = type.annotation;
  var offset = annotation.position;

  var x1 = annotation.x - offset.x,
      x2 = x1 + annotation.dx,
      y1 = annotation.y - offset.y,
      y2 = y1 + annotation.dy;

  var subjectData = annotation.subject;

  if (subjectType === "circle" && (subjectData.outerRadius || subjectData.radius)) {
    var h = Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
    var angle = Math.asin(-y2 / h);
    var r = subjectData.outerRadius || subjectData.radius + (subjectData.radiusPadding || 0);

    x1 = Math.abs(Math.cos(angle) * r) * (x2 < 0 ? -1 : 1);
    y1 = Math.abs(Math.sin(angle) * r) * (y2 < 0 ? -1 : 1);
  }

  if (subjectType === "rect") {
    var width = subjectData.width,
        height = subjectData.height;


    if (width > 0 && annotation.dx > 0 || width < 0 && annotation.dx < 0) {
      if (Math.abs(width) > Math.abs(annotation.dx)) x1 = width / 2;else x1 = width;
    }
    if (height > 0 && annotation.dy > 0 || height < 0 && annotation.dy < 0) {
      if (Math.abs(height) > Math.abs(annotation.dy)) y1 = height / 2;else y1 = height;
    }
    if (x1 === width / 2 && y1 === height / 2) {
      x1 = x2;y1 = y2;
    }
  }

  return [[x1, y1], [x2, y2]];
};

var connectorLine = (function (connectorData) {
  var data = lineSetup(connectorData);
  return { components: [lineBuilder({ data: data, className: "connector" })] };
});

var connectorElbow = (function (_ref) {
  var type = _ref.type,
      subjectType = _ref.subjectType;


  var annotation = type.annotation;
  var offset = annotation.position;

  var x1 = annotation.x - offset.x,
      x2 = x1 + annotation.dx,
      y1 = annotation.y - offset.y,
      y2 = y1 + annotation.dy;

  var subjectData = annotation.subject;

  if (subjectType === "rect") {
    var width = subjectData.width,
        height = subjectData.height;


    if (width > 0 && annotation.dx > 0 || width < 0 && annotation.dx < 0) {
      if (Math.abs(width) > Math.abs(annotation.dx)) x1 = width / 2;else x1 = width;
    }
    if (height > 0 && annotation.dy > 0 || height < 0 && annotation.dy < 0) {
      if (Math.abs(height) > Math.abs(annotation.dy)) y1 = height / 2;else y1 = height;
    }
    if (x1 === width / 2 && y1 === height / 2) {
      x1 = x2;y1 = y2;
    }
  }

  var data = [[x1, y1], [x2, y2]];

  var diffY = y2 - y1;
  var diffX = x2 - x1;
  var xe = x2;
  var ye = y2;
  var opposite = y2 < y1 && x2 > x1 || x2 < x1 && y2 > y1 ? -1 : 1;

  if (Math.abs(diffX) < Math.abs(diffY)) {
    xe = x2;
    ye = y1 + diffX * opposite;
  } else {
    ye = y2;
    xe = x1 + diffY * opposite;
  }

  if (subjectType === "circle" && (subjectData.outerRadius || subjectData.radius)) {
    var r = (subjectData.outerRadius || subjectData.radius) + (subjectData.radiusPadding || 0);
    var length = r / Math.sqrt(2);

    if (Math.abs(diffX) > length && Math.abs(diffY) > length) {
      x1 = length * (x2 < 0 ? -1 : 1);
      y1 = length * (y2 < 0 ? -1 : 1);
      data = [[x1, y1], [xe, ye], [x2, y2]];
    } else if (Math.abs(diffX) > Math.abs(diffY)) {
      var angle = Math.asin(-y2 / r);
      x1 = Math.abs(Math.cos(angle) * r) * (x2 < 0 ? -1 : 1);
      data = [[x1, y2], [x2, y2]];
    } else {
      var _angle = Math.acos(x2 / r);
      y1 = Math.abs(Math.sin(_angle) * r) * (y2 < 0 ? -1 : 1);
      data = [[x2, y1], [x2, y2]];
    }
  } else {
    data = [[x1, y1], [xe, ye], [x2, y2]];
  }

  return { components: [lineBuilder({ data: data, className: "connector" })] };
});

var connectorCurve = (function (_ref) {
  var type = _ref.type,
      connectorData = _ref.connectorData,
      subjectType = _ref.subjectType;


  if (!connectorData) {
    connectorData = {};
  }
  if (!connectorData.points || typeof connectorData.points === "number") {
    connectorData.points = createPoints(type.annotation.offset, connectorData.points);
  }
  if (!connectorData.curve) {
    connectorData.curve = curveCatmullRom;
  }

  var handles = [];

  if (type.editMode) {
    var cHandles = connectorData.points.map(function (c, i) {
      return _extends({}, pointHandle({ cx: c[0], cy: c[1] }), { index: i });
    });

    var updatePoint = function updatePoint(index) {
      connectorData.points[index][0] += event.dx;
      connectorData.points[index][1] += event.dy;
      type.redrawConnector();
    };

    handles = type.mapHandles(cHandles.map(function (h) {
      return _extends({}, h.move, { drag: updatePoint.bind(type, h.index) });
    }));
  }

  var data = lineSetup({ type: type, subjectType: subjectType });
  data = [data[0]].concat(toConsumableArray(connectorData.points), [data[1]]);
  var components = [lineBuilder({ data: data, curve: connectorData.curve, className: "connector" })];

  return { components: components, handles: handles };
});

var createPoints = function createPoints(offset) {
  var anchors = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2;

  var diff = { x: offset.x / (anchors + 1), y: offset.y / (anchors + 1) };
  var p = [];

  var i = 1;
  for (; i <= anchors; i++) {
    p.push([diff.x * i + i % 2 * 20, diff.y * i - i % 2 * 20]);
  }
  return p;
};

var connectorArrow = (function (_ref) {
  var annotation = _ref.annotation,
      start = _ref.start,
      end = _ref.end,
      _ref$scale = _ref.scale,
      scale = _ref$scale === undefined ? 1 : _ref$scale;

  var offset = annotation.position;
  if (!start) {
    start = [annotation.dx, annotation.dy];
  } else {
    start = [-end[0] + start[0], -end[1] + start[1]];
  }
  if (!end) {
    end = [annotation.x - offset.x, annotation.y - offset.y];
  }

  var x1 = end[0],
      y1 = end[1];

  var dx = start[0];
  var dy = start[1];

  var size = 10 * scale;
  var angleOffset = 16 / 180 * Math.PI;
  var angle = Math.atan(dy / dx);

  if (dx < 0) {
    angle += Math.PI;
  }

  var data = [[x1, y1], [Math.cos(angle + angleOffset) * size + x1, Math.sin(angle + angleOffset) * size + y1], [Math.cos(angle - angleOffset) * size + x1, Math.sin(angle - angleOffset) * size + y1], [x1, y1]];

  //TODO add in reverse
  // if (canvasContext.arrowReverse){
  //   data = [[x1, y1],
  //   [Math.cos(angle + angleOffset)*size, Math.sin(angle + angleOffset)*size],
  //   [Math.cos(angle - angleOffset)*size, Math.sin(angle - angleOffset)*size],
  //   [x1, y1]
  //   ]
  // } else {
  //   data = [[x1, y1],
  //   [Math.cos(angle + angleOffset)*size, Math.sin(angle + angleOffset)*size],
  //   [Math.cos(angle - angleOffset)*size, Math.sin(angle - angleOffset)*size],
  //   [x1, y1]
  //   ]
  // }

  return {
    components: [lineBuilder({
      data: data,
      className: "connector-end connector-arrow",
      classID: "connector-end"
    })]
  };
});

var connectorDot = (function (_ref) {
  var line = _ref.line,
      _ref$scale = _ref.scale,
      scale = _ref$scale === undefined ? 1 : _ref$scale;

  var dot = arcBuilder({
    className: "connector-end connector-dot",
    classID: "connector-end",
    data: { radius: 3 * Math.sqrt(scale) }
  });
  dot.attrs.transform = "translate(" + line.data[0][0] + ", " + line.data[0][1] + ")";

  return { components: [dot] };
});

var subjectCircle = (function (_ref) {
  var subjectData = _ref.subjectData,
      type = _ref.type;

  if (!subjectData.radius && !subjectData.outerRadius) {
    subjectData.radius = 20;
  }

  var handles = [];
  var c = arcBuilder({ data: subjectData, className: "subject" });
  if (type.editMode) {
    var h = circleHandles({
      r1: c.data.outerRadius || c.data.radius,
      r2: c.data.innerRadius,
      padding: subjectData.radiusPadding
    });

    var updateRadius = function updateRadius(attr) {
      var r = subjectData[attr] + event.dx * Math.sqrt(2);
      subjectData[attr] = r;
      type.redrawSubject();
      type.redrawConnector();
    };

    var cHandles = [_extends({}, h.r1, {
      drag: updateRadius.bind(type, subjectData.outerRadius !== undefined ? "outerRadius" : "radius")
    })];

    if (subjectData.innerRadius) {
      cHandles.push(_extends({}, h.r2, { drag: updateRadius.bind(type, "innerRadius") }));
    }
    handles = type.mapHandles(cHandles);
  }

  c.attrs["fill-opacity"] = 0;

  return { components: [c], handles: handles };
});

var subjectRect = (function (_ref) {
  var subjectData = _ref.subjectData,
      type = _ref.type;

  if (!subjectData.width) {
    subjectData.width = 100;
  }
  if (!subjectData.height) {
    subjectData.height = 100;
  }

  var handles = [];
  var width = subjectData.width,
      height = subjectData.height;


  var data = [[0, 0], [width, 0], [width, height], [0, height], [0, 0]];
  var rect = lineBuilder({ data: data, className: "subject" });

  if (type.editMode) {
    var updateWidth = function updateWidth() {
      subjectData.width = event.x;
      type.redrawSubject();
      type.redrawConnector();
    };

    var updateHeight = function updateHeight() {
      subjectData.height = event.y;
      type.redrawSubject();
      type.redrawConnector();
    };

    var rHandles = [{ x: width, y: height / 2, drag: updateWidth.bind(type) }, { x: width / 2, y: height, drag: updateHeight.bind(type) }];

    handles = type.mapHandles(rHandles);
  }
  rect.attrs["fill-opacity"] = 0.1;
  return { components: [rect], handles: handles };
});

var subjectThreshold = (function (_ref) {
  var subjectData = _ref.subjectData,
      type = _ref.type;

  var offset = type.annotation.position;

  var x1 = (subjectData.x1 !== undefined ? subjectData.x1 : offset.x) - offset.x,
      x2 = (subjectData.x2 !== undefined ? subjectData.x2 : offset.x) - offset.x,
      y1 = (subjectData.y1 !== undefined ? subjectData.y1 : offset.y) - offset.y,
      y2 = (subjectData.y2 !== undefined ? subjectData.y2 : offset.y) - offset.y;

  var data = [[x1, y1], [x2, y2]];
  return { components: [lineBuilder({ data: data, className: 'subject' })] };
});

var subjectBadge = (function (_ref) {
  var _ref$subjectData = _ref.subjectData,
      subjectData = _ref$subjectData === undefined ? {} : _ref$subjectData,
      _ref$type = _ref.type,
      type = _ref$type === undefined ? {} : _ref$type;
  var annotation = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var typeSettings = type.typeSettings && type.typeSettings.subject;

  if (!subjectData.radius) {
    if (typeSettings && typeSettings.radius) {
      subjectData.radius = typeSettings.radius;
    } else {
      subjectData.radius = 14;
    }
  }
  if (!subjectData.x) {
    if (typeSettings && typeSettings.x) {
      subjectData.x = typeSettings.x;
    }
  }
  if (!subjectData.y) {
    if (typeSettings && typeSettings.y) {
      subjectData.y = typeSettings.y;
    }
  }

  var handles = [];
  var components = [];
  var radius = subjectData.radius;
  var innerRadius = radius * 0.7;
  var x = 0;
  var y = 0;

  var notCornerOffset = Math.sqrt(2) * radius;
  var placement = {
    xleftcorner: -radius,
    xrightcorner: radius,
    ytopcorner: -radius,
    ybottomcorner: radius,
    xleft: -notCornerOffset,
    xright: notCornerOffset,
    ytop: -notCornerOffset,
    ybottom: notCornerOffset
  };

  if (subjectData.x && !subjectData.y) {
    x = placement["x" + subjectData.x];
  } else if (subjectData.y && !subjectData.x) {
    y = placement["y" + subjectData.y];
  } else if (subjectData.x && subjectData.y) {
    x = placement["x" + subjectData.x + "corner"];
    y = placement["y" + subjectData.y + "corner"];
  }

  var transform = "translate(" + x + ", " + y + ")";
  var circlebg = arcBuilder({ className: "subject", data: { radius: radius } });
  circlebg.attrs.transform = transform;
  circlebg.attrs.fill = annotation.color;
  circlebg.attrs["stroke-linecap"] = "round";
  circlebg.attrs["stroke-width"] = "3px";

  var circle = arcBuilder({
    className: "subject-ring",
    data: { outerRadius: radius, innerRadius: innerRadius }
  });

  circle.attrs.transform = transform;
  // circle.attrs.fill = annotation.color
  circle.attrs["stroke-width"] = "3px";
  circle.attrs.fill = "white";

  var pointer = void 0;
  if (x && y || !x && !y) {
    pointer = lineBuilder({
      className: "subject-pointer",
      data: [[0, 0], [x || 0, 0], [0, y || 0], [0, 0]]
    });
  } else if (x || y) {
    var notCornerPointerXY = function notCornerPointerXY(v) {
      var sign = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
      return v && v / Math.sqrt(2) / Math.sqrt(2) || sign * radius / Math.sqrt(2);
    };

    pointer = lineBuilder({
      className: "subject-pointer",
      data: [[0, 0], [notCornerPointerXY(x), notCornerPointerXY(y)], [notCornerPointerXY(x, -1), notCornerPointerXY(y, -1)], [0, 0]]
    });
  }

  if (pointer) {
    pointer.attrs.fill = annotation.color;
    pointer.attrs["stroke-linecap"] = "round";
    pointer.attrs["stroke-width"] = "3px";
    components.push(pointer);
  }

  if (type.editMode) {
    var dragBadge = function dragBadge() {
      subjectData.x = event.x < -radius * 2 ? "left" : event.x > radius * 2 ? "right" : undefined;
      subjectData.y = event.y < -radius * 2 ? "top" : event.y > radius * 2 ? "bottom" : undefined;

      type.redrawSubject();
    };

    var bHandles = { x: x * 2, y: y * 2, drag: dragBadge.bind(type) };
    if (!bHandles.x && !bHandles.y) {
      bHandles.y = -radius;
    }

    handles = type.mapHandles([bHandles]);
  }

  var text = void 0;
  if (subjectData.text) {
    text = {
      type: "text",
      className: "badge-text",
      attrs: {
        fill: "white",
        stroke: "none",
        "font-size": ".7em",
        text: subjectData.text,
        "text-anchor": "middle",
        dy: ".25em",
        x: x,
        y: y
      }
    };
  }

  components.push(circlebg);
  components.push(circle);
  components.push(text);

  return { components: components, handles: handles };
});

//Note options
//Connector options
//Subject options
var Type = function () {
  function Type(_ref) {
    var a = _ref.a,
        annotation = _ref.annotation,
        editMode = _ref.editMode,
        dispatcher = _ref.dispatcher,
        notePadding = _ref.notePadding,
        accessors = _ref.accessors;
    classCallCheck(this, Type);

    this.a = a;

    this.note = annotation.disable.indexOf("note") === -1 && a.select("g.annotation-note");
    this.noteContent = this.note && a.select("g.annotation-note-content");
    this.connector = annotation.disable.indexOf("connector") === -1 && a.select("g.annotation-connector");
    this.subject = annotation.disable.indexOf("subject") === -1 && a.select("g.annotation-subject");
    this.dispatcher = dispatcher;

    if (dispatcher) {
      var handler = addHandlers.bind(null, dispatcher, annotation);
      handler({ component: this.note, name: "note" });
      handler({ component: this.connector, name: "connector" });
      handler({ component: this.subject, name: "subject" });
    }

    this.annotation = annotation;
    this.editMode = annotation.editMode || editMode;
    this.notePadding = notePadding !== undefined ? notePadding : 3;
    this.offsetCornerX = 0;
    this.offsetCornerY = 0;

    if (accessors && annotation.data) {
      this.init(accessors);
    }
  }

  createClass(Type, [{
    key: "init",
    value: function init(accessors) {
      if (!this.annotation.x) {
        this.mapX(accessors);
      }
      if (!this.annotation.y) {
        this.mapY(accessors);
      }
    }
  }, {
    key: "mapY",
    value: function mapY(accessors) {
      if (accessors.y) {
        this.annotation.y = accessors.y(this.annotation.data);
      }
    }
  }, {
    key: "mapX",
    value: function mapX(accessors) {
      if (accessors.x) {
        this.annotation.x = accessors.x(this.annotation.data);
      }
    }
  }, {
    key: "updateEditMode",
    value: function updateEditMode() {
      this.a.selectAll("circle.handle").remove();
    }
  }, {
    key: "drawOnSVG",
    value: function drawOnSVG(component, builders) {
      var _this = this;

      if (!Array.isArray(builders)) {
        builders = [builders];
      }

      builders.filter(function (b) {
        return b;
      }).forEach(function (_ref2) {
        var type = _ref2.type,
            className = _ref2.className,
            attrs = _ref2.attrs,
            handles = _ref2.handles,
            classID = _ref2.classID;

        if (type === "handle") {
          addHandles({ group: component, r: attrs && attrs.r, handles: handles });
        } else {
          newWithClass(component, [_this.annotation], type, className, classID);
          var el = component.select(type + "." + (classID || className));
          var addAttrs = Object.keys(attrs);
          var removeAttrs = [];

          var currentAttrs = el.node().attributes;
          for (var i = currentAttrs.length - 1; i >= 0; i--) {
            var name = currentAttrs[i].name;
            if (addAttrs.indexOf(name) === -1 && name !== "class") removeAttrs.push(name);
          }

          addAttrs.forEach(function (attr) {
            if (attr === "text") {
              el.text(attrs[attr]);
            } else {
              el.attr(attr, attrs[attr]);
            }
          });

          removeAttrs.forEach(function (attr) {
            return el.attr(attr, null);
          });
        }
      });
    }

    //TODO: how to extend this to a drawOnCanvas mode?

  }, {
    key: "getNoteBBox",
    value: function getNoteBBox() {
      return bboxWithoutHandles(this.note, ".annotation-note-content text");
    }
  }, {
    key: "getNoteBBoxOffset",
    value: function getNoteBBoxOffset() {
      var bbox = bboxWithoutHandles(this.note, ".annotation-note-content");
      var transform = this.noteContent.attr("transform").split(/\(|\,|\)/g);
      bbox.offsetCornerX = parseFloat(transform[1]) + this.annotation.dx;
      bbox.offsetCornerY = parseFloat(transform[2]) + this.annotation.dy;
      bbox.offsetX = this.annotation.dx;
      bbox.offsetY = this.annotation.dy;
      return bbox;
    }
  }, {
    key: "drawSubject",
    value: function drawSubject() {
      var _this2 = this;

      var context = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      var subjectData = this.annotation.subject;
      var type = context.type;
      var subjectParams = { type: this, subjectData: subjectData };

      var subject = {};
      if (type === "circle") subject = subjectCircle(subjectParams);else if (type === "rect") subject = subjectRect(subjectParams);else if (type === "threshold") subject = subjectThreshold(subjectParams);else if (type === "badge") subject = subjectBadge(subjectParams, this.annotation);

      var _subject = subject,
          _subject$components = _subject.components,
          components = _subject$components === undefined ? [] : _subject$components,
          _subject$handles = _subject.handles,
          handles = _subject$handles === undefined ? [] : _subject$handles;

      components.forEach(function (c) {
        if (c && c.attrs && !c.attrs.stroke) {
          c.attrs.stroke = _this2.annotation.color;
        }
      });

      if (this.editMode) {
        handles = handles.concat(this.mapHandles([{ drag: this.dragSubject.bind(this) }]));
        components.push({ type: "handle", handles: handles });
      }

      return components;
    }
  }, {
    key: "drawConnector",
    value: function drawConnector() {
      var _this3 = this;

      var context = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      var connectorData = this.annotation.connector;
      var type = connectorData.type || context.type;
      var connectorParams = { type: this, connectorData: connectorData };
      connectorParams.subjectType = this.typeSettings && this.typeSettings.subject && this.typeSettings.subject.type;

      var connector = {};
      if (type === "curve") connector = connectorCurve(connectorParams);else if (type === "elbow") connector = connectorElbow(connectorParams);else connector = connectorLine(connectorParams);
      var _connector = connector,
          _connector$components = _connector.components,
          components = _connector$components === undefined ? [] : _connector$components,
          _connector$handles = _connector.handles,
          handles = _connector$handles === undefined ? [] : _connector$handles;

      var line = components[0];
      //TODO: genericize this into fill t/f stroke t/f
      if (line) {
        line.attrs.stroke = this.annotation.color;
        line.attrs.fill = "none";
      }
      var endType = connectorData.end || context.end;
      var end = {};
      if (endType === "arrow") {
        var s = line.data[1];
        var e = line.data[0];
        var distance = Math.sqrt(Math.pow(s[0] - e[0], 2) + Math.pow(s[1] - e[1], 2));
        if (distance < 5 && line.data[2]) {
          s = line.data[2];
        }
        end = connectorArrow({
          annotation: this.annotation,
          start: s,
          end: e,
          scale: connectorData.endScale
        });
      } else if (endType === "dot") {
        end = connectorDot({ line: line, scale: connectorData.endScale });
      } else if (!endType || endType === "none") {
        this.connector && this.connector.select(".connector-end").remove();
      }

      if (end.components) {
        end.components.forEach(function (c) {
          c.attrs.fill = _this3.annotation.color;
          c.attrs.stroke = _this3.annotation.color;
        });
        components = components.concat(end.components);
      }

      if (this.editMode) {
        if (handles.length !== 0) components.push({ type: "handle", handles: handles });
      }
      return components;
    }
  }, {
    key: "drawNote",
    value: function drawNote() {
      var _this4 = this;

      var context = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      var noteData = this.annotation.note;
      var align = noteData.align || context.align || "dynamic";
      var noteParams = {
        bbox: context.bbox,
        align: align,
        offset: this.annotation.offset
      };
      var lineType = noteData.lineType || context.lineType;
      var note = {};
      if (lineType === "vertical") note = noteVertical(noteParams);else if (lineType === "horizontal") note = noteHorizontal(noteParams);

      var _note = note,
          _note$components = _note.components,
          components = _note$components === undefined ? [] : _note$components,
          _note$handles = _note.handles,
          handles = _note$handles === undefined ? [] : _note$handles;

      components.forEach(function (c) {
        c.attrs.stroke = _this4.annotation.color;
      });

      if (this.editMode) {
        handles = this.mapHandles([{ x: 0, y: 0, drag: this.dragNote.bind(this) }]);
        components.push({ type: "handle", handles: handles });

        var dragging = this.dragNote.bind(this),
            start = this.dragstarted.bind(this),
            end = this.dragended.bind(this);
        this.note.call(drag().container(select("g.annotations").node()).on("start", function (d) {
          return start(d);
        }).on("drag", function (d) {
          return dragging(d);
        }).on("end", function (d) {
          return end(d);
        }));
      } else {
        this.note.on("mousedown.drag", null);
      }
      return components;
    }
  }, {
    key: "drawNoteContent",
    value: function drawNoteContent(context) {
      var noteData = this.annotation.note;
      var padding = noteData.padding !== undefined ? noteData.padding : this.notePadding;
      var orientation = noteData.orientation || context.orientation || "topBottom";
      var lineType = noteData.lineType || context.lineType;
      var align = noteData.align || context.align || "dynamic";

      if (lineType === "vertical") orientation = "leftRight";else if (lineType === "horizontal") orientation = "topBottom";

      var noteParams = {
        padding: padding,
        bbox: context.bbox,
        offset: this.annotation.offset,
        orientation: orientation,
        align: align
      };

      var _noteAlignment = noteAlignment(noteParams),
          x = _noteAlignment.x,
          y = _noteAlignment.y;

      this.offsetCornerX = x + this.annotation.dx;
      this.offsetCornerY = y + this.annotation.dy;
      this.note && this.noteContent.attr("transform", "translate(" + x + ", " + y + ")");

      return [];
    }
  }, {
    key: "drawOnScreen",
    value: function drawOnScreen(component, drawFunction) {
      return this.drawOnSVG(component, drawFunction);
    }
  }, {
    key: "redrawSubject",
    value: function redrawSubject() {
      this.subject && this.drawOnScreen(this.subject, this.drawSubject());
    }
  }, {
    key: "redrawConnector",
    value: function redrawConnector() {
      this.connector && this.drawOnScreen(this.connector, this.drawConnector());
    }
  }, {
    key: "redrawNote",
    value: function redrawNote() {
      var bbox = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.getNoteBBox();

      this.noteContent && this.drawOnScreen(this.noteContent, this.drawNoteContent({ bbox: bbox }));
      this.note && this.drawOnScreen(this.note, this.drawNote({ bbox: bbox }));
    }
  }, {
    key: "setPosition",
    value: function setPosition() {
      var position = this.annotation.position;
      this.a.attr("transform", "translate(" + position.x + ", " + position.y + ")");
    }
  }, {
    key: "clearComponents",
    value: function clearComponents() {
      this.subject && this.subject.select("*").remove();
      this.connector && this.connector.select("*").remove();
      // this.note && this.note.select("*").remove()
    }
  }, {
    key: "setOffset",
    value: function setOffset() {
      if (this.note) {
        var offset = this.annotation.offset;
        this.note.attr("transform", "translate(" + offset.x + ", " + offset.y + ")");
      }
    }
  }, {
    key: "setPositionWithAccessors",
    value: function setPositionWithAccessors(accessors) {
      if (accessors && this.annotation.data) {
        this.mapX(accessors);
        this.mapY(accessors);
      }
      this.setPosition();
    }
  }, {
    key: "setClassName",
    value: function setClassName() {
      this.a.attr("class", "annotation " + (this.className && this.className()) + " " + (this.editMode ? "editable" : "") + " " + (this.annotation.className || ""));
    }
  }, {
    key: "draw",
    value: function draw() {
      this.setClassName();
      this.setPosition();
      this.setOffset();
      this.redrawSubject();
      this.redrawConnector();
      this.redrawNote();
    }
  }, {
    key: "dragstarted",
    value: function dragstarted() {
      event.sourceEvent.stopPropagation();
      this.dispatcher && this.dispatcher.call("dragstart", this.a, this.annotation);
      this.a.classed("dragging", true);
      this.a.selectAll("circle.handle").style("pointer-events", "none");
    }
  }, {
    key: "dragended",
    value: function dragended() {
      this.dispatcher && this.dispatcher.call("dragend", this.a, this.annotation);
      this.a.classed("dragging", false);
      this.a.selectAll("circle.handle").style("pointer-events", "all");
    }
  }, {
    key: "dragSubject",
    value: function dragSubject() {
      var position = this.annotation.position;
      position.x += event.dx;
      position.y += event.dy;
      this.annotation.position = position;
    }
  }, {
    key: "dragNote",
    value: function dragNote() {
      var offset = this.annotation.offset;
      offset.x += event.dx;
      offset.y += event.dy;
      this.annotation.offset = offset;
    }
  }, {
    key: "mapHandles",
    value: function mapHandles(handles) {
      var _this5 = this;

      return handles.map(function (h) {
        return _extends({}, h, {
          start: _this5.dragstarted.bind(_this5),
          end: _this5.dragended.bind(_this5)
        });
      });
    }
  }]);
  return Type;
}();

var customType = function customType(initialType, typeSettings, _init) {
  return function (_initialType) {
    inherits(customType, _initialType);

    function customType(settings) {
      classCallCheck(this, customType);

      var _this6 = possibleConstructorReturn(this, (customType.__proto__ || Object.getPrototypeOf(customType)).call(this, settings));

      _this6.typeSettings = typeSettings;

      if (typeSettings.disable) {
        typeSettings.disable.forEach(function (d) {
          _this6[d] && _this6[d].remove();

          _this6[d] = undefined;
          if (d === "note") {
            _this6.noteContent = undefined;
          }
        });
      }
      return _this6;
    }

    createClass(customType, [{
      key: "className",
      value: function className() {
        return "" + (typeSettings.className || get(customType.prototype.__proto__ || Object.getPrototypeOf(customType.prototype), "className", this) && get(customType.prototype.__proto__ || Object.getPrototypeOf(customType.prototype), "className", this).call(this) || "");
      }
    }, {
      key: "drawSubject",
      value: function drawSubject(context) {
        this.typeSettings.subject = _extends({}, typeSettings.subject, this.typeSettings.subject);
        return get(customType.prototype.__proto__ || Object.getPrototypeOf(customType.prototype), "drawSubject", this).call(this, _extends({}, context, this.typeSettings.subject));
      }
    }, {
      key: "drawConnector",
      value: function drawConnector(context) {
        this.typeSettings.connector = _extends({}, typeSettings.connector, this.typeSettings.connector);
        return get(customType.prototype.__proto__ || Object.getPrototypeOf(customType.prototype), "drawConnector", this).call(this, _extends({}, context, typeSettings.connector, this.typeSettings.connector));
      }
    }, {
      key: "drawNote",
      value: function drawNote(context) {
        this.typeSettings.note = _extends({}, typeSettings.note, this.typeSettings.note);
        return get(customType.prototype.__proto__ || Object.getPrototypeOf(customType.prototype), "drawNote", this).call(this, _extends({}, context, typeSettings.note, this.typeSettings.note));
      }
    }, {
      key: "drawNoteContent",
      value: function drawNoteContent(context) {
        return get(customType.prototype.__proto__ || Object.getPrototypeOf(customType.prototype), "drawNoteContent", this).call(this, _extends({}, context, typeSettings.note, this.typeSettings.note));
      }
    }], [{
      key: "init",
      value: function init(annotation, accessors) {
        get(customType.__proto__ || Object.getPrototypeOf(customType), "init", this).call(this, annotation, accessors);
        if (_init) {
          annotation = _init(annotation, accessors);
        }
        return annotation;
      }
    }]);
    return customType;
  }(initialType);
};

var d3NoteText = function (_Type) {
  inherits(d3NoteText, _Type);

  function d3NoteText(params) {
    classCallCheck(this, d3NoteText);

    var _this7 = possibleConstructorReturn(this, (d3NoteText.__proto__ || Object.getPrototypeOf(d3NoteText)).call(this, params));

    _this7.textWrap = params.textWrap || 120;
    _this7.drawText();
    return _this7;
  }

  createClass(d3NoteText, [{
    key: "updateTextWrap",
    value: function updateTextWrap(textWrap) {
      this.textWrap = textWrap;
      this.drawText();
    }

    //TODO: add update text functionality

  }, {
    key: "drawText",
    value: function drawText() {
      if (this.note) {
        newWithClass(this.note, [this.annotation], "g", "annotation-note-content");

        var noteContent = this.note.select("g.annotation-note-content");
        newWithClass(noteContent, [this.annotation], "rect", "annotation-note-bg");
        newWithClass(noteContent, [this.annotation], "text", "annotation-note-label");
        newWithClass(noteContent, [this.annotation], "text", "annotation-note-title");

        var titleBBox = { height: 0 };
        var label = this.a.select("text.annotation-note-label");
        var wrapLength = this.annotation.note && this.annotation.note.wrap || this.typeSettings && this.typeSettings.note && this.typeSettings.note.wrap || this.textWrap;

        var wrapSplitter = this.annotation.note && this.annotation.note.wrapSplitter || this.typeSettings && this.typeSettings.note && this.typeSettings.note.wrapSplitter;

        var bgPadding = this.annotation.note && this.annotation.note.bgPadding || this.typeSettings && this.typeSettings.note && this.typeSettings.note.bgPadding;

        var bgPaddingFinal = { top: 0, bottom: 0, left: 0, right: 0 };
        if (typeof bgPadding === "number") {
          bgPaddingFinal = {
            top: bgPadding,
            bottom: bgPadding,
            left: bgPadding,
            right: bgPadding
          };
        } else if (bgPadding && (typeof bgPadding === "undefined" ? "undefined" : _typeof(bgPadding)) === "object") {
          bgPaddingFinal = _extends(bgPaddingFinal, bgPadding);
        }

        if (this.annotation.note.title) {
          var title = this.a.select("text.annotation-note-title");
          title.text(this.annotation.note.title);
          title.attr("fill", this.annotation.color);
          title.attr("font-weight", "bold");
          title.call(wrap, wrapLength, wrapSplitter);
          titleBBox = title.node().getBBox();
        }

        label.text(this.annotation.note.label).attr("dx", "0");
        label.call(wrap, wrapLength, wrapSplitter);

        label.attr("y", titleBBox.height * 1.1 || 0);
        label.attr("fill", this.annotation.color);

        var bbox = this.getNoteBBox();

        this.a.select("rect.annotation-note-bg").attr("width", bbox.width + bgPaddingFinal.left + bgPaddingFinal.right).attr("height", bbox.height + bgPaddingFinal.top + bgPaddingFinal.bottom).attr("x", bbox.x - bgPaddingFinal.left).attr("y", -bgPaddingFinal.top).attr("fill", "white").attr("fill-opacity", 0);
      }
    }
  }]);
  return d3NoteText;
}(Type);

var d3Label = customType(d3NoteText, {
  className: "label",
  note: { align: "middle" }
});

var d3Callout = customType(d3NoteText, {
  className: "callout",
  note: { lineType: "horizontal" }
});

var d3CalloutElbow = customType(d3Callout, {
  className: "callout elbow",
  connector: { type: "elbow" }
});

var d3CalloutCurve = customType(d3Callout, {
  className: "callout curve",
  connector: { type: "curve" }
});

var d3Badge = customType(Type, {
  className: "badge",
  subject: { type: "badge" },
  disable: ["connector", "note"]
});

var d3CalloutCircle = customType(d3NoteText, {
  className: "callout circle",
  subject: { type: "circle" },
  note: { lineType: "horizontal" },
  connector: { type: "elbow" }
});

var d3CalloutRect = customType(d3NoteText, {
  className: "callout rect",
  subject: { type: "rect" },
  note: { lineType: "horizontal" },
  connector: { type: "elbow" }
});

var ThresholdMap = function (_d3Callout) {
  inherits(ThresholdMap, _d3Callout);

  function ThresholdMap() {
    classCallCheck(this, ThresholdMap);
    return possibleConstructorReturn(this, (ThresholdMap.__proto__ || Object.getPrototypeOf(ThresholdMap)).apply(this, arguments));
  }

  createClass(ThresholdMap, [{
    key: "mapY",
    value: function mapY(accessors) {
      get(ThresholdMap.prototype.__proto__ || Object.getPrototypeOf(ThresholdMap.prototype), "mapY", this).call(this, accessors);
      var a = this.annotation;
      if ((a.subject.x1 || a.subject.x2) && a.data && accessors.y) {
        a.y = accessors.y(a.data);
      }
      if ((a.subject.x1 || a.subject.x2) && !a.x) {
        a.x = a.subject.x1 || a.subject.x2;
      }
    }
  }, {
    key: "mapX",
    value: function mapX(accessors) {
      get(ThresholdMap.prototype.__proto__ || Object.getPrototypeOf(ThresholdMap.prototype), "mapX", this).call(this, accessors);
      var a = this.annotation;
      if ((a.subject.y1 || a.subject.y2) && a.data && accessors.x) {
        a.x = accessors.x(a.data);
      }
      if ((a.subject.y1 || a.subject.y2) && !a.y) {
        a.y = a.subject.y1 || a.subject.y2;
      }
    }
  }]);
  return ThresholdMap;
}(d3Callout);

var d3XYThreshold = customType(ThresholdMap, {
  className: "callout xythreshold",
  subject: { type: "threshold" }
});

var newWithClass = function newWithClass(a, d, type, className, classID) {
  var group = a.selectAll(type + "." + (classID || className)).data(d);
  group.enter().append(type).merge(group).attr("class", className);

  group.exit().remove();
  return a;
};

var addHandlers = function addHandlers(dispatcher, annotation, _ref3) {
  var component = _ref3.component,
      name = _ref3.name;

  if (component) {
    component.on("mouseover.annotations", function () {
      dispatcher.call(name + "over", component, annotation);
    }).on("mouseout.annotations", function () {
      return dispatcher.call(name + "out", component, annotation);
    }).on("click.annotations", function () {
      return dispatcher.call(name + "click", component, annotation);
    });
  }
};

//Text wrapping code adapted from Mike Bostock
var wrap = function wrap(text, width, wrapSplitter) {
  var lineHeight = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1.2;

  text.each(function () {
    var text = select(this),
        words = text.text().split(wrapSplitter || /[ \t\r\n]+/).reverse().filter(function (w) {
      return w !== "";
    });
    var word = void 0,
        line = [],
        tspan = text.text(null).append("tspan").attr("x", 0).attr("dy", 0.8 + "em");

    while (word = words.pop()) {
      line.push(word);
      tspan.text(line.join(" "));
      if (tspan.node().getComputedTextLength() > width && line.length > 1) {
        line.pop();
        tspan.text(line.join(" "));
        line = [word];
        tspan = text.append("tspan").attr("x", 0).attr("dy", lineHeight + "em").text(word);
      }
    }
  });
};

var bboxWithoutHandles = function bboxWithoutHandles(selection$$1) {
  var selector$$1 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ":not(.handle)";

  if (!selection$$1) {
    return { x: 0, y: 0, width: 0, height: 0 };
  }

  return selection$$1.selectAll(selector$$1).nodes().reduce(function (p, c) {
    var bbox = c.getBBox();
    p.x = Math.min(p.x, bbox.x);
    p.y = Math.min(p.y, bbox.y);
    p.width = Math.max(p.width, bbox.width);

    var yOffset = c && c.attributes && c.attributes.y;
    p.height = Math.max(p.height, (yOffset && parseFloat(yOffset.value) || 0) + bbox.height);
    return p;
  }, { x: 0, y: 0, width: 0, height: 0 });
};

var noop$2 = { value: function value() {} };

function dispatch$2() {
  for (var i = 0, n = arguments.length, _ = {}, t; i < n; ++i) {
    if (!(t = arguments[i] + "") || t in _) throw new Error("illegal type: " + t);
    _[t] = [];
  }
  return new Dispatch$1(_);
}

function Dispatch$1(_) {
  this._ = _;
}

function parseTypenames$2(typenames, types) {
  return typenames.trim().split(/^|\s+/).map(function (t) {
    var name = "",
        i = t.indexOf(".");
    if (i >= 0) name = t.slice(i + 1), t = t.slice(0, i);
    if (t && !types.hasOwnProperty(t)) throw new Error("unknown type: " + t);
    return { type: t, name: name };
  });
}

Dispatch$1.prototype = dispatch$2.prototype = {
  constructor: Dispatch$1,
  on: function on(typename, callback) {
    var _ = this._,
        T = parseTypenames$2(typename + "", _),
        t,
        i = -1,
        n = T.length;

    // If no callback was specified, return the callback of the given type and name.
    if (arguments.length < 2) {
      while (++i < n) {
        if ((t = (typename = T[i]).type) && (t = get$2(_[t], typename.name))) return t;
      }return;
    }

    // If a type was specified, set the callback for the given type and name.
    // Otherwise, if a null callback was specified, remove callbacks of the given name.
    if (callback != null && typeof callback !== "function") throw new Error("invalid callback: " + callback);
    while (++i < n) {
      if (t = (typename = T[i]).type) _[t] = set$2(_[t], typename.name, callback);else if (callback == null) for (t in _) {
        _[t] = set$2(_[t], typename.name, null);
      }
    }

    return this;
  },
  copy: function copy() {
    var copy = {},
        _ = this._;
    for (var t in _) {
      copy[t] = _[t].slice();
    }return new Dispatch$1(copy);
  },
  call: function call(type, that) {
    if ((n = arguments.length - 2) > 0) for (var args = new Array(n), i = 0, n, t; i < n; ++i) {
      args[i] = arguments[i + 2];
    }if (!this._.hasOwnProperty(type)) throw new Error("unknown type: " + type);
    for (t = this._[type], i = 0, n = t.length; i < n; ++i) {
      t[i].value.apply(that, args);
    }
  },
  apply: function apply(type, that, args) {
    if (!this._.hasOwnProperty(type)) throw new Error("unknown type: " + type);
    for (var t = this._[type], i = 0, n = t.length; i < n; ++i) {
      t[i].value.apply(that, args);
    }
  }
};

function get$2(type, name) {
  for (var i = 0, n = type.length, c; i < n; ++i) {
    if ((c = type[i]).name === name) {
      return c.value;
    }
  }
}

function set$2(type, name, callback) {
  for (var i = 0, n = type.length; i < n; ++i) {
    if (type[i].name === name) {
      type[i] = noop$2, type = type.slice(0, i).concat(type.slice(i + 1));
      break;
    }
  }
  if (callback != null) type.push({ name: name, value: callback });
  return type;
}

function annotation() {
  var annotations = [],
      collection = void 0,
      context = void 0,
      //TODO: add canvas functionality
  disable = [],
      accessors = {},
      accessorsInverse = {},
      editMode = false,
      ids = void 0,
      type = d3Callout,
      textWrap = void 0,
      notePadding = void 0,
      annotationDispatcher = dispatch$2("subjectover", "subjectout", "subjectclick", "connectorover", "connectorout", "connectorclick", "noteover", "noteout", "noteclick", "dragend", "dragstart"),
      sel = void 0;

  var annotation = function annotation(selection$$1) {
    sel = selection$$1;
    //TODO: check to see if this is still needed
    if (!editMode) {
      selection$$1.selectAll("circle.handle").remove();
    }

    var translatedAnnotations = annotations.map(function (a) {
      if (!a.type) {
        a.type = type;
      }
      if (!a.disable) {
        a.disable = disable;
      }
      return new Annotation(a);
    });

    collection = collection || new AnnotationCollection({
      annotations: translatedAnnotations,
      accessors: accessors,
      accessorsInverse: accessorsInverse,
      ids: ids
    });

    var annotationG = selection$$1.selectAll("g").data([collection]);
    annotationG.enter().append("g").attr("class", "annotations");

    var group = selection$$1.select("g.annotations");
    newWithClass(group, collection.annotations, "g", "annotation");

    var annotation = group.selectAll("g.annotation");

    annotation.each(function (d) {
      var a = select(this);

      a.attr("class", "annotation");

      newWithClass(a, [d], "g", "annotation-connector");
      newWithClass(a, [d], "g", "annotation-subject");
      newWithClass(a, [d], "g", "annotation-note");
      newWithClass(a.select("g.annotation-note"), [d], "g", "annotation-note-content");
      d.type = d.type.toString() === "[object Object]" ? d.type : new d.type({
        a: a,
        annotation: d,
        textWrap: textWrap,
        notePadding: notePadding,
        editMode: editMode,
        dispatcher: annotationDispatcher,
        accessors: accessors
      });
      d.type.draw();
      d.type.drawText && d.type.drawText();
    });
  };

  annotation.json = function () {
    /* eslint-disable no-console */
    console.log("Annotations JSON was copied to your clipboard. Please note the annotation type is not JSON compatible. It appears in the objects array in the console, but not in the copied JSON.", collection.json);
    /* eslint-enable no-console */
    window.copy(JSON.stringify(collection.json.map(function (a) {
      delete a.type;
      return a;
    })));
    return annotation;
  };

  annotation.update = function () {
    if (annotations && collection) {
      annotations = collection.annotations.map(function (a) {
        a.type.draw();
        return a;
      });
    }
    return annotation;
  };

  annotation.updateText = function () {
    if (collection) {
      collection.updateText(textWrap);
      annotations = collection.annotations;
    }
    return annotation;
  };

  annotation.updatedAccessors = function () {
    collection.setPositionWithAccessors();
    annotations = collection.annotations;
    return annotation;
  };

  annotation.disable = function (_) {
    if (!arguments.length) return disable;
    disable = _;
    if (collection) {
      collection.updateDisable(disable);
      annotations = collection.annotations;
    }
    return annotation;
  };

  annotation.textWrap = function (_) {
    if (!arguments.length) return textWrap;
    textWrap = _;
    if (collection) {
      collection.updateTextWrap(textWrap);
      annotations = collection.annotations;
    }
    return annotation;
  };

  annotation.notePadding = function (_) {
    if (!arguments.length) return notePadding;
    notePadding = _;
    if (collection) {
      collection.updateNotePadding(notePadding);
      annotations = collection.annotations;
    }
    return annotation;
  };
  //todo think of how to handle when undefined is sent
  annotation.type = function (_, settings) {
    if (!arguments.length) return type;
    type = _;
    if (collection) {
      collection.annotations.map(function (a) {
        a.type.note && a.type.note.selectAll("*:not(.annotation-note-content)").remove();
        a.type.noteContent && a.type.noteContent.selectAll("*").remove();
        a.type.subject && a.type.subject.selectAll("*").remove();
        a.type.connector && a.type.connector.selectAll("*").remove();
        a.type.typeSettings = {};
        a.type = type;

        a.subject = settings && settings.subject || a.subject;
        a.connector = settings && settings.connector || a.connector;
        a.note = settings && settings.note || a.note;
      });

      annotations = collection.annotations;
    }
    return annotation;
  };

  annotation.annotations = function (_) {
    if (!arguments.length) return collection && collection.annotations || annotations;
    annotations = _;

    if (collection && collection.annotations) {
      var rerun = annotations.some(function (d) {
        return !d.type || d.type.toString() !== "[object Object]";
      });

      if (rerun) {
        collection = null;
        annotation(sel);
      } else {
        collection.annotations = annotations;
      }
    }
    return annotation;
  };

  annotation.context = function (_) {
    if (!arguments.length) return context;
    context = _;
    return annotation;
  };

  annotation.accessors = function (_) {
    if (!arguments.length) return accessors;
    accessors = _;
    return annotation;
  };

  annotation.accessorsInverse = function (_) {
    if (!arguments.length) return accessorsInverse;
    accessorsInverse = _;
    return annotation;
  };

  annotation.ids = function (_) {
    if (!arguments.length) return ids;
    ids = _;
    return annotation;
  };

  annotation.editMode = function (_) {
    if (!arguments.length) return editMode;
    editMode = _;

    if (sel) {
      sel.selectAll("g.annotation").classed("editable", editMode);
    }

    if (collection) {
      collection.editMode(editMode);
      annotations = collection.annotations;
    }
    return annotation;
  };

  annotation.collection = function (_) {
    if (!arguments.length) return collection;
    collection = _;
    return annotation;
  };

  annotation.on = function () {
    var value = annotationDispatcher.on.apply(annotationDispatcher, arguments);
    return value === annotationDispatcher ? annotation : value;
  };

  return annotation;
}

var index = {
  annotation: annotation,
  annotationTypeBase: Type,
  annotationLabel: d3Label,
  annotationCallout: d3Callout,
  annotationCalloutCurve: d3CalloutCurve,
  annotationCalloutElbow: d3CalloutElbow,
  annotationCalloutCircle: d3CalloutCircle,
  annotationCalloutRect: d3CalloutRect,
  annotationXYThreshold: d3XYThreshold,
  annotationBadge: d3Badge,
  annotationCustomType: customType
};

exports.annotation = annotation;
exports.annotationTypeBase = Type;
exports.annotationLabel = d3Label;
exports.annotationCallout = d3Callout;
exports.annotationCalloutCurve = d3CalloutCurve;
exports.annotationCalloutElbow = d3CalloutElbow;
exports.annotationCalloutCircle = d3CalloutCircle;
exports.annotationCalloutRect = d3CalloutRect;
exports.annotationXYThreshold = d3XYThreshold;
exports.annotationBadge = d3Badge;
exports.annotationCustomType = customType;
exports['default'] = index;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=indexRollup.js.map
