/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const W = globalThis, ce = W.ShadowRoot && (W.ShadyCSS === void 0 || W.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, le = Symbol(), me = /* @__PURE__ */ new WeakMap();
let Oe = class {
  constructor(e, i, s) {
    if (this._$cssResult$ = !0, s !== le) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = e, this.t = i;
  }
  get styleSheet() {
    let e = this.o;
    const i = this.t;
    if (ce && e === void 0) {
      const s = i !== void 0 && i.length === 1;
      s && (e = me.get(i)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), s && me.set(i, e));
    }
    return e;
  }
  toString() {
    return this.cssText;
  }
};
const We = (t) => new Oe(typeof t == "string" ? t : t + "", void 0, le), de = (t, ...e) => {
  const i = t.length === 1 ? t[0] : e.reduce((s, r, n) => s + ((a) => {
    if (a._$cssResult$ === !0) return a.cssText;
    if (typeof a == "number") return a;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + a + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(r) + t[n + 1], t[0]);
  return new Oe(i, t, le);
}, Ve = (t, e) => {
  if (ce) t.adoptedStyleSheets = e.map((i) => i instanceof CSSStyleSheet ? i : i.styleSheet);
  else for (const i of e) {
    const s = document.createElement("style"), r = W.litNonce;
    r !== void 0 && s.setAttribute("nonce", r), s.textContent = i.cssText, t.appendChild(s);
  }
}, ge = ce ? (t) => t : (t) => t instanceof CSSStyleSheet ? ((e) => {
  let i = "";
  for (const s of e.cssRules) i += s.cssText;
  return We(i);
})(t) : t;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: Je, defineProperty: Ye, getOwnPropertyDescriptor: Ge, getOwnPropertyNames: Ze, getOwnPropertySymbols: Xe, getPrototypeOf: Qe } = Object, x = globalThis, fe = x.trustedTypes, et = fe ? fe.emptyScript : "", ee = x.reactiveElementPolyfillSupport, L = (t, e) => t, V = { toAttribute(t, e) {
  switch (e) {
    case Boolean:
      t = t ? et : null;
      break;
    case Object:
    case Array:
      t = t == null ? t : JSON.stringify(t);
  }
  return t;
}, fromAttribute(t, e) {
  let i = t;
  switch (e) {
    case Boolean:
      i = t !== null;
      break;
    case Number:
      i = t === null ? null : Number(t);
      break;
    case Object:
    case Array:
      try {
        i = JSON.parse(t);
      } catch {
        i = null;
      }
  }
  return i;
} }, pe = (t, e) => !Je(t, e), be = { attribute: !0, type: String, converter: V, reflect: !1, useDefault: !1, hasChanged: pe };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), x.litPropertyMetadata ?? (x.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let T = class extends HTMLElement {
  static addInitializer(e) {
    this._$Ei(), (this.l ?? (this.l = [])).push(e);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(e, i = be) {
    if (i.state && (i.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((i = Object.create(i)).wrapped = !0), this.elementProperties.set(e, i), !i.noAccessor) {
      const s = Symbol(), r = this.getPropertyDescriptor(e, s, i);
      r !== void 0 && Ye(this.prototype, e, r);
    }
  }
  static getPropertyDescriptor(e, i, s) {
    const { get: r, set: n } = Ge(this.prototype, e) ?? { get() {
      return this[i];
    }, set(a) {
      this[i] = a;
    } };
    return { get: r, set(a) {
      const l = r == null ? void 0 : r.call(this);
      n == null || n.call(this, a), this.requestUpdate(e, l, s);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(e) {
    return this.elementProperties.get(e) ?? be;
  }
  static _$Ei() {
    if (this.hasOwnProperty(L("elementProperties"))) return;
    const e = Qe(this);
    e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(L("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(L("properties"))) {
      const i = this.properties, s = [...Ze(i), ...Xe(i)];
      for (const r of s) this.createProperty(r, i[r]);
    }
    const e = this[Symbol.metadata];
    if (e !== null) {
      const i = litPropertyMetadata.get(e);
      if (i !== void 0) for (const [s, r] of i) this.elementProperties.set(s, r);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [i, s] of this.elementProperties) {
      const r = this._$Eu(i, s);
      r !== void 0 && this._$Eh.set(r, i);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(e) {
    const i = [];
    if (Array.isArray(e)) {
      const s = new Set(e.flat(1 / 0).reverse());
      for (const r of s) i.unshift(ge(r));
    } else e !== void 0 && i.push(ge(e));
    return i;
  }
  static _$Eu(e, i) {
    const s = i.attribute;
    return s === !1 ? void 0 : typeof s == "string" ? s : typeof e == "string" ? e.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    var e;
    this._$ES = new Promise((i) => this.enableUpdating = i), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), (e = this.constructor.l) == null || e.forEach((i) => i(this));
  }
  addController(e) {
    var i;
    (this._$EO ?? (this._$EO = /* @__PURE__ */ new Set())).add(e), this.renderRoot !== void 0 && this.isConnected && ((i = e.hostConnected) == null || i.call(e));
  }
  removeController(e) {
    var i;
    (i = this._$EO) == null || i.delete(e);
  }
  _$E_() {
    const e = /* @__PURE__ */ new Map(), i = this.constructor.elementProperties;
    for (const s of i.keys()) this.hasOwnProperty(s) && (e.set(s, this[s]), delete this[s]);
    e.size > 0 && (this._$Ep = e);
  }
  createRenderRoot() {
    const e = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return Ve(e, this.constructor.elementStyles), e;
  }
  connectedCallback() {
    var e;
    this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this.enableUpdating(!0), (e = this._$EO) == null || e.forEach((i) => {
      var s;
      return (s = i.hostConnected) == null ? void 0 : s.call(i);
    });
  }
  enableUpdating(e) {
  }
  disconnectedCallback() {
    var e;
    (e = this._$EO) == null || e.forEach((i) => {
      var s;
      return (s = i.hostDisconnected) == null ? void 0 : s.call(i);
    });
  }
  attributeChangedCallback(e, i, s) {
    this._$AK(e, s);
  }
  _$ET(e, i) {
    var n;
    const s = this.constructor.elementProperties.get(e), r = this.constructor._$Eu(e, s);
    if (r !== void 0 && s.reflect === !0) {
      const a = (((n = s.converter) == null ? void 0 : n.toAttribute) !== void 0 ? s.converter : V).toAttribute(i, s.type);
      this._$Em = e, a == null ? this.removeAttribute(r) : this.setAttribute(r, a), this._$Em = null;
    }
  }
  _$AK(e, i) {
    var n, a;
    const s = this.constructor, r = s._$Eh.get(e);
    if (r !== void 0 && this._$Em !== r) {
      const l = s.getPropertyOptions(r), o = typeof l.converter == "function" ? { fromAttribute: l.converter } : ((n = l.converter) == null ? void 0 : n.fromAttribute) !== void 0 ? l.converter : V;
      this._$Em = r;
      const d = o.fromAttribute(i, l.type);
      this[r] = d ?? ((a = this._$Ej) == null ? void 0 : a.get(r)) ?? d, this._$Em = null;
    }
  }
  requestUpdate(e, i, s, r = !1, n) {
    var a;
    if (e !== void 0) {
      const l = this.constructor;
      if (r === !1 && (n = this[e]), s ?? (s = l.getPropertyOptions(e)), !((s.hasChanged ?? pe)(n, i) || s.useDefault && s.reflect && n === ((a = this._$Ej) == null ? void 0 : a.get(e)) && !this.hasAttribute(l._$Eu(e, s)))) return;
      this.C(e, i, s);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(e, i, { useDefault: s, reflect: r, wrapped: n }, a) {
    s && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(e) && (this._$Ej.set(e, a ?? i ?? this[e]), n !== !0 || a !== void 0) || (this._$AL.has(e) || (this.hasUpdated || s || (i = void 0), this._$AL.set(e, i)), r === !0 && this._$Em !== e && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(e));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (i) {
      Promise.reject(i);
    }
    const e = this.scheduleUpdate();
    return e != null && await e, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    var s;
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this._$Ep) {
        for (const [n, a] of this._$Ep) this[n] = a;
        this._$Ep = void 0;
      }
      const r = this.constructor.elementProperties;
      if (r.size > 0) for (const [n, a] of r) {
        const { wrapped: l } = a, o = this[n];
        l !== !0 || this._$AL.has(n) || o === void 0 || this.C(n, void 0, a, o);
      }
    }
    let e = !1;
    const i = this._$AL;
    try {
      e = this.shouldUpdate(i), e ? (this.willUpdate(i), (s = this._$EO) == null || s.forEach((r) => {
        var n;
        return (n = r.hostUpdate) == null ? void 0 : n.call(r);
      }), this.update(i)) : this._$EM();
    } catch (r) {
      throw e = !1, this._$EM(), r;
    }
    e && this._$AE(i);
  }
  willUpdate(e) {
  }
  _$AE(e) {
    var i;
    (i = this._$EO) == null || i.forEach((s) => {
      var r;
      return (r = s.hostUpdated) == null ? void 0 : r.call(s);
    }), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(e)), this.updated(e);
  }
  _$EM() {
    this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = !1;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$ES;
  }
  shouldUpdate(e) {
    return !0;
  }
  update(e) {
    this._$Eq && (this._$Eq = this._$Eq.forEach((i) => this._$ET(i, this[i]))), this._$EM();
  }
  updated(e) {
  }
  firstUpdated(e) {
  }
};
T.elementStyles = [], T.shadowRootOptions = { mode: "open" }, T[L("elementProperties")] = /* @__PURE__ */ new Map(), T[L("finalized")] = /* @__PURE__ */ new Map(), ee == null || ee({ ReactiveElement: T }), (x.reactiveElementVersions ?? (x.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const U = globalThis, _e = (t) => t, J = U.trustedTypes, ye = J ? J.createPolicy("lit-html", { createHTML: (t) => t }) : void 0, De = "$lit$", v = `lit$${Math.random().toFixed(9).slice(2)}$`, Ie = "?" + v, tt = `<${Ie}>`, P = document, H = () => P.createComment(""), j = (t) => t === null || typeof t != "object" && typeof t != "function", he = Array.isArray, it = (t) => he(t) || typeof (t == null ? void 0 : t[Symbol.iterator]) == "function", te = `[ 	
\f\r]`, D = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, ve = /-->/g, xe = />/g, A = RegExp(`>|${te}(?:([^\\s"'>=/]+)(${te}*=${te}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), $e = /'/g, we = /"/g, Le = /^(?:script|style|textarea|title)$/i, Ue = (t) => (e, ...i) => ({ _$litType$: t, strings: e, values: i }), c = Ue(1), re = Ue(2), z = Symbol.for("lit-noChange"), p = Symbol.for("lit-nothing"), ke = /* @__PURE__ */ new WeakMap(), E = P.createTreeWalker(P, 129);
function He(t, e) {
  if (!he(t) || !t.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return ye !== void 0 ? ye.createHTML(e) : e;
}
const st = (t, e) => {
  const i = t.length - 1, s = [];
  let r, n = e === 2 ? "<svg>" : e === 3 ? "<math>" : "", a = D;
  for (let l = 0; l < i; l++) {
    const o = t[l];
    let d, h, g = -1, u = 0;
    for (; u < o.length && (a.lastIndex = u, h = a.exec(o), h !== null); ) u = a.lastIndex, a === D ? h[1] === "!--" ? a = ve : h[1] !== void 0 ? a = xe : h[2] !== void 0 ? (Le.test(h[2]) && (r = RegExp("</" + h[2], "g")), a = A) : h[3] !== void 0 && (a = A) : a === A ? h[0] === ">" ? (a = r ?? D, g = -1) : h[1] === void 0 ? g = -2 : (g = a.lastIndex - h[2].length, d = h[1], a = h[3] === void 0 ? A : h[3] === '"' ? we : $e) : a === we || a === $e ? a = A : a === ve || a === xe ? a = D : (a = A, r = void 0);
    const b = a === A && t[l + 1].startsWith("/>") ? " " : "";
    n += a === D ? o + tt : g >= 0 ? (s.push(d), o.slice(0, g) + De + o.slice(g) + v + b) : o + v + (g === -2 ? l : b);
  }
  return [He(t, n + (t[i] || "<?>") + (e === 2 ? "</svg>" : e === 3 ? "</math>" : "")), s];
};
class B {
  constructor({ strings: e, _$litType$: i }, s) {
    let r;
    this.parts = [];
    let n = 0, a = 0;
    const l = e.length - 1, o = this.parts, [d, h] = st(e, i);
    if (this.el = B.createElement(d, s), E.currentNode = this.el.content, i === 2 || i === 3) {
      const g = this.el.content.firstChild;
      g.replaceWith(...g.childNodes);
    }
    for (; (r = E.nextNode()) !== null && o.length < l; ) {
      if (r.nodeType === 1) {
        if (r.hasAttributes()) for (const g of r.getAttributeNames()) if (g.endsWith(De)) {
          const u = h[a++], b = r.getAttribute(g).split(v), S = /([.?@])?(.*)/.exec(u);
          o.push({ type: 1, index: n, name: S[2], strings: b, ctor: S[1] === "." ? nt : S[1] === "?" ? at : S[1] === "@" ? ot : G }), r.removeAttribute(g);
        } else g.startsWith(v) && (o.push({ type: 6, index: n }), r.removeAttribute(g));
        if (Le.test(r.tagName)) {
          const g = r.textContent.split(v), u = g.length - 1;
          if (u > 0) {
            r.textContent = J ? J.emptyScript : "";
            for (let b = 0; b < u; b++) r.append(g[b], H()), E.nextNode(), o.push({ type: 2, index: ++n });
            r.append(g[u], H());
          }
        }
      } else if (r.nodeType === 8) if (r.data === Ie) o.push({ type: 2, index: n });
      else {
        let g = -1;
        for (; (g = r.data.indexOf(v, g + 1)) !== -1; ) o.push({ type: 7, index: n }), g += v.length - 1;
      }
      n++;
    }
  }
  static createElement(e, i) {
    const s = P.createElement("template");
    return s.innerHTML = e, s;
  }
}
function R(t, e, i = t, s) {
  var a, l;
  if (e === z) return e;
  let r = s !== void 0 ? (a = i._$Co) == null ? void 0 : a[s] : i._$Cl;
  const n = j(e) ? void 0 : e._$litDirective$;
  return (r == null ? void 0 : r.constructor) !== n && ((l = r == null ? void 0 : r._$AO) == null || l.call(r, !1), n === void 0 ? r = void 0 : (r = new n(t), r._$AT(t, i, s)), s !== void 0 ? (i._$Co ?? (i._$Co = []))[s] = r : i._$Cl = r), r !== void 0 && (e = R(t, r._$AS(t, e.values), r, s)), e;
}
class rt {
  constructor(e, i) {
    this._$AV = [], this._$AN = void 0, this._$AD = e, this._$AM = i;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(e) {
    const { el: { content: i }, parts: s } = this._$AD, r = ((e == null ? void 0 : e.creationScope) ?? P).importNode(i, !0);
    E.currentNode = r;
    let n = E.nextNode(), a = 0, l = 0, o = s[0];
    for (; o !== void 0; ) {
      if (a === o.index) {
        let d;
        o.type === 2 ? d = new F(n, n.nextSibling, this, e) : o.type === 1 ? d = new o.ctor(n, o.name, o.strings, this, e) : o.type === 6 && (d = new ct(n, this, e)), this._$AV.push(d), o = s[++l];
      }
      a !== (o == null ? void 0 : o.index) && (n = E.nextNode(), a++);
    }
    return E.currentNode = P, r;
  }
  p(e) {
    let i = 0;
    for (const s of this._$AV) s !== void 0 && (s.strings !== void 0 ? (s._$AI(e, s, i), i += s.strings.length - 2) : s._$AI(e[i])), i++;
  }
}
class F {
  get _$AU() {
    var e;
    return ((e = this._$AM) == null ? void 0 : e._$AU) ?? this._$Cv;
  }
  constructor(e, i, s, r) {
    this.type = 2, this._$AH = p, this._$AN = void 0, this._$AA = e, this._$AB = i, this._$AM = s, this.options = r, this._$Cv = (r == null ? void 0 : r.isConnected) ?? !0;
  }
  get parentNode() {
    let e = this._$AA.parentNode;
    const i = this._$AM;
    return i !== void 0 && (e == null ? void 0 : e.nodeType) === 11 && (e = i.parentNode), e;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(e, i = this) {
    e = R(this, e, i), j(e) ? e === p || e == null || e === "" ? (this._$AH !== p && this._$AR(), this._$AH = p) : e !== this._$AH && e !== z && this._(e) : e._$litType$ !== void 0 ? this.$(e) : e.nodeType !== void 0 ? this.T(e) : it(e) ? this.k(e) : this._(e);
  }
  O(e) {
    return this._$AA.parentNode.insertBefore(e, this._$AB);
  }
  T(e) {
    this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
  }
  _(e) {
    this._$AH !== p && j(this._$AH) ? this._$AA.nextSibling.data = e : this.T(P.createTextNode(e)), this._$AH = e;
  }
  $(e) {
    var n;
    const { values: i, _$litType$: s } = e, r = typeof s == "number" ? this._$AC(e) : (s.el === void 0 && (s.el = B.createElement(He(s.h, s.h[0]), this.options)), s);
    if (((n = this._$AH) == null ? void 0 : n._$AD) === r) this._$AH.p(i);
    else {
      const a = new rt(r, this), l = a.u(this.options);
      a.p(i), this.T(l), this._$AH = a;
    }
  }
  _$AC(e) {
    let i = ke.get(e.strings);
    return i === void 0 && ke.set(e.strings, i = new B(e)), i;
  }
  k(e) {
    he(this._$AH) || (this._$AH = [], this._$AR());
    const i = this._$AH;
    let s, r = 0;
    for (const n of e) r === i.length ? i.push(s = new F(this.O(H()), this.O(H()), this, this.options)) : s = i[r], s._$AI(n), r++;
    r < i.length && (this._$AR(s && s._$AB.nextSibling, r), i.length = r);
  }
  _$AR(e = this._$AA.nextSibling, i) {
    var s;
    for ((s = this._$AP) == null ? void 0 : s.call(this, !1, !0, i); e !== this._$AB; ) {
      const r = _e(e).nextSibling;
      _e(e).remove(), e = r;
    }
  }
  setConnected(e) {
    var i;
    this._$AM === void 0 && (this._$Cv = e, (i = this._$AP) == null || i.call(this, e));
  }
}
class G {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(e, i, s, r, n) {
    this.type = 1, this._$AH = p, this._$AN = void 0, this.element = e, this.name = i, this._$AM = r, this.options = n, s.length > 2 || s[0] !== "" || s[1] !== "" ? (this._$AH = Array(s.length - 1).fill(new String()), this.strings = s) : this._$AH = p;
  }
  _$AI(e, i = this, s, r) {
    const n = this.strings;
    let a = !1;
    if (n === void 0) e = R(this, e, i, 0), a = !j(e) || e !== this._$AH && e !== z, a && (this._$AH = e);
    else {
      const l = e;
      let o, d;
      for (e = n[0], o = 0; o < n.length - 1; o++) d = R(this, l[s + o], i, o), d === z && (d = this._$AH[o]), a || (a = !j(d) || d !== this._$AH[o]), d === p ? e = p : e !== p && (e += (d ?? "") + n[o + 1]), this._$AH[o] = d;
    }
    a && !r && this.j(e);
  }
  j(e) {
    e === p ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
  }
}
class nt extends G {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(e) {
    this.element[this.name] = e === p ? void 0 : e;
  }
}
class at extends G {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(e) {
    this.element.toggleAttribute(this.name, !!e && e !== p);
  }
}
class ot extends G {
  constructor(e, i, s, r, n) {
    super(e, i, s, r, n), this.type = 5;
  }
  _$AI(e, i = this) {
    if ((e = R(this, e, i, 0) ?? p) === z) return;
    const s = this._$AH, r = e === p && s !== p || e.capture !== s.capture || e.once !== s.once || e.passive !== s.passive, n = e !== p && (s === p || r);
    r && this.element.removeEventListener(this.name, this, s), n && this.element.addEventListener(this.name, this, e), this._$AH = e;
  }
  handleEvent(e) {
    var i;
    typeof this._$AH == "function" ? this._$AH.call(((i = this.options) == null ? void 0 : i.host) ?? this.element, e) : this._$AH.handleEvent(e);
  }
}
class ct {
  constructor(e, i, s) {
    this.element = e, this.type = 6, this._$AN = void 0, this._$AM = i, this.options = s;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(e) {
    R(this, e);
  }
}
const ie = U.litHtmlPolyfillSupport;
ie == null || ie(B, F), (U.litHtmlVersions ?? (U.litHtmlVersions = [])).push("3.3.3");
const lt = (t, e, i) => {
  const s = (i == null ? void 0 : i.renderBefore) ?? e;
  let r = s._$litPart$;
  if (r === void 0) {
    const n = (i == null ? void 0 : i.renderBefore) ?? null;
    s._$litPart$ = r = new F(e.insertBefore(H(), n), n, void 0, i ?? {});
  }
  return r._$AI(t), r;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const C = globalThis;
class $ extends T {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    var i;
    const e = super.createRenderRoot();
    return (i = this.renderOptions).renderBefore ?? (i.renderBefore = e.firstChild), e;
  }
  update(e) {
    const i = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = lt(i, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    var e;
    super.connectedCallback(), (e = this._$Do) == null || e.setConnected(!0);
  }
  disconnectedCallback() {
    var e;
    super.disconnectedCallback(), (e = this._$Do) == null || e.setConnected(!1);
  }
  render() {
    return z;
  }
}
var Re;
$._$litElement$ = !0, $.finalized = !0, (Re = C.litElementHydrateSupport) == null || Re.call(C, { LitElement: $ });
const se = C.litElementPolyfillSupport;
se == null || se({ LitElement: $ });
(C.litElementVersions ?? (C.litElementVersions = [])).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Z = (t) => (e, i) => {
  i !== void 0 ? i.addInitializer(() => {
    customElements.define(t, e);
  }) : customElements.define(t, e);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const dt = { attribute: !0, type: String, converter: V, reflect: !1, hasChanged: pe }, pt = (t = dt, e, i) => {
  const { kind: s, metadata: r } = i;
  let n = globalThis.litPropertyMetadata.get(r);
  if (n === void 0 && globalThis.litPropertyMetadata.set(r, n = /* @__PURE__ */ new Map()), s === "setter" && ((t = Object.create(t)).wrapped = !0), n.set(i.name, t), s === "accessor") {
    const { name: a } = i;
    return { set(l) {
      const o = e.get.call(this);
      e.set.call(this, l), this.requestUpdate(a, o, t, !0, l);
    }, init(l) {
      return l !== void 0 && this.C(a, void 0, t, l), l;
    } };
  }
  if (s === "setter") {
    const { name: a } = i;
    return function(l) {
      const o = this[a];
      e.call(this, l), this.requestUpdate(a, o, t, !0, l);
    };
  }
  throw Error("Unsupported decorator location: " + s);
};
function q(t) {
  return (e, i) => typeof i == "object" ? pt(t, e, i) : ((s, r, n) => {
    const a = r.hasOwnProperty(n);
    return r.constructor.createProperty(n, s), a ? Object.getOwnPropertyDescriptor(r, n) : void 0;
  })(t, e, i);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function _(t) {
  return q({ ...t, state: !0, attribute: !1 });
}
const ne = {
  en: {
    // sections
    now_playing: "Now playing",
    stats: "Library",
    recently_added: "Recently added",
    activity: "Activity",
    top: "Most watched",
    requests: "Requests",
    custom: "Sensors",
    // now playing
    nothing_playing: "Nothing is playing",
    idle_hint: "Active streams appear here automatically",
    streams: "Streams",
    stream: "Stream",
    direct_play: "Direct Play",
    transcode: "Transcode",
    bandwidth: "Bandwidth",
    paused: "Paused",
    buffering: "Buffering",
    // recently added
    new: "NEW",
    no_items: "No entries",
    fetch_error: "Not reachable — check URL/token (CORS?)",
    // requests
    pending: "Pending",
    approved: "Approved",
    processing: "Processing",
    available: "Available",
    declined: "Declined",
    total: "Total",
    movies: "Movies",
    tv: "Series",
    // activity
    last_hours: "Last {n} h",
    last_days: "Last {n} d",
    range_h: "{n} h",
    range_d: "{n} d",
    peak: "Peak",
    now: "Now",
    // misc
    entity_missing: "Entity not found",
    no_data: "No data",
    online: "Online",
    offline: "Offline"
  },
  de: {
    now_playing: "Läuft gerade",
    stats: "Mediathek",
    recently_added: "Zuletzt hinzugefügt",
    activity: "Aktivität",
    top: "Meistgesehen",
    requests: "Anfragen",
    custom: "Sensoren",
    nothing_playing: "Gerade läuft nichts",
    idle_hint: "Aktive Streams erscheinen hier automatisch",
    streams: "Streams",
    stream: "Stream",
    direct_play: "Direct Play",
    transcode: "Transkodierung",
    bandwidth: "Bandbreite",
    paused: "Pausiert",
    buffering: "Puffern",
    new: "NEU",
    no_items: "Keine Einträge",
    fetch_error: "Nicht erreichbar — URL/Token prüfen (CORS?)",
    pending: "Ausstehend",
    approved: "Genehmigt",
    processing: "In Arbeit",
    available: "Verfügbar",
    declined: "Abgelehnt",
    total: "Gesamt",
    movies: "Filme",
    tv: "Serien",
    last_hours: "Letzte {n} h",
    last_days: "Letzte {n} T",
    range_h: "{n} h",
    range_d: "{n} T",
    peak: "Spitze",
    now: "Jetzt",
    entity_missing: "Entität nicht gefunden",
    no_data: "Keine Daten",
    online: "Online",
    offline: "Offline"
  }
};
function je(t) {
  var i;
  const e = (((i = t == null ? void 0 : t.locale) == null ? void 0 : i.language) ?? (t == null ? void 0 : t.language) ?? "en").split("-")[0];
  return ne[e] ? e : "en";
}
function m(t, e, i) {
  let s = ne[je(t)][e] ?? ne.en[e] ?? e;
  if (i) for (const [r, n] of Object.entries(i)) s = s.replace(`{${r}}`, String(n));
  return s;
}
function ht(t, e) {
  return e < 48 ? m(t, "range_h", { n: e }) : m(t, "range_d", { n: Math.round(e / 24) });
}
function ut(t, e) {
  return e <= 48 ? m(t, "last_hours", { n: e }) : m(t, "last_days", { n: Math.round(e / 24) });
}
function ae(t) {
  var e;
  return ((e = t == null ? void 0 : t.locale) == null ? void 0 : e.language) ?? (t == null ? void 0 : t.language) ?? "en";
}
function f(t, e, i = 0) {
  return Number.isFinite(t) ? t.toLocaleString(ae(e), {
    minimumFractionDigits: i,
    maximumFractionDigits: i
  }) : "–";
}
function mt(t, e, i) {
  if (!Number.isFinite(t)) return "–";
  let r = t * ({
    b: 1,
    kb: 1e3,
    mb: 1e6,
    gb: 1e9,
    tb: 1e12
  }[(i ?? "b").toLowerCase()] ?? 1);
  const n = ["B", "KB", "MB", "GB", "TB", "PB"];
  let a = 0;
  for (; r >= 1e3 && a < n.length - 1; )
    r /= 1e3, a++;
  return `${f(r, e, r >= 100 ? 0 : 1)} ${n[a]}`;
}
function Be(t, e) {
  return Number.isFinite(t) ? t >= 1e3 ? `${f(t / 1e3, e, 1)} Mbps` : `${f(t, e, 0)} kbps` : "–";
}
function K(t) {
  if (!Number.isFinite(t) || t < 0) return "0:00";
  const e = Math.floor(t % 60), i = Math.floor(t / 60 % 60), s = Math.floor(t / 3600), r = s ? String(i).padStart(2, "0") : String(i);
  return `${s ? `${s}:` : ""}${r}:${String(e).padStart(2, "0")}`;
}
function gt(t, e) {
  if (!Number.isFinite(t)) return "–";
  const i = Math.floor(t / 60), s = Math.round(t % 60);
  return i ? s ? `${f(i, e)} h ${s} min` : `${f(i, e)} h` : `${s} min`;
}
function ft(t, e) {
  if (!Number.isFinite(t)) return "";
  const i = new Intl.RelativeTimeFormat(ae(e), { numeric: "auto" }), s = (t - Date.now()) / 1e3, r = Math.abs(s);
  return r < 3600 ? i.format(Math.round(s / 60), "minute") : r < 86400 ? i.format(Math.round(s / 3600), "hour") : r < 86400 * 30 ? i.format(Math.round(s / 86400), "day") : new Date(t).toLocaleDateString(ae(e), {
    day: "numeric",
    month: "short"
  });
}
const M = ["playing", "buffering", "paused"];
function bt(t) {
  const e = t.attributes, i = e.media_content_id ?? e.media_title;
  return i ? `${e.username ?? e.session_username ?? e.user ?? ""}|${i}` : t.entity_id;
}
function Se(t) {
  const e = t.attributes;
  return (e.entity_picture ? 2 : 0) + (e.app_name ? 1 : 0) + Object.keys(e).length / 100;
}
function Ae(t) {
  const e = /* @__PURE__ */ new Map();
  for (const i of t) {
    const s = bt(i), r = e.get(s);
    r ? r.push(i) : e.set(s, [i]);
  }
  return [...e.values()].map(
    (i) => i.sort(
      (s, r) => M.indexOf(s.state) - M.indexOf(r.state) || Se(r) - Se(s)
    )[0]
  );
}
function I(t, e, i) {
  var n;
  if ((n = e.players) != null && n.length) {
    const a = e.players.map((l) => t.states[l]).filter((l) => !!l && M.includes(l.state));
    return Ae(a);
  }
  const s = (e.match ?? i).toLowerCase(), r = Object.values(t.states).filter(
    (a) => a.entity_id.startsWith("media_player.") && M.includes(a.state) && (a.entity_id.toLowerCase().includes(s) || String(a.attributes.app_name ?? "").toLowerCase().includes(s) || String(a.attributes.friendly_name ?? "").toLowerCase().includes(s))
  );
  return Ae(r).sort(
    (a, l) => M.indexOf(a.state) - M.indexOf(l.state) || a.entity_id.localeCompare(l.entity_id)
  );
}
function _t(t) {
  if (!t) return;
  const e = t.match(/\(([^)]+)\)\s*$/);
  return e ? e[1] : t;
}
function Ee(t) {
  const e = t.attributes, i = e.media_content_type;
  let s = e.media_title ?? "", r;
  i === "tvshow" || i === "episode" || e.media_series_title ? (s = e.media_series_title ?? s, r = [e.media_season != null && e.media_episode != null ? `S${e.media_season} · E${e.media_episode}` : void 0, e.media_title].filter(Boolean).join(" · ")) : i === "music" || e.media_artist ? (s = e.media_title ?? "", r = [e.media_artist, e.media_album_name].filter(Boolean).join(" · ")) : e.media_year && (r = String(e.media_year));
  const n = e.media_position_updated_at;
  return {
    entityId: t.entity_id,
    state: t.state,
    user: e.username ?? e.session_username ?? e.user ?? void 0,
    title: s || (e.friendly_name ?? t.entity_id),
    subline: r,
    mediaType: i,
    poster: e.entity_picture ?? void 0,
    device: e.app_name ?? _t(e.friendly_name),
    position: typeof e.media_position == "number" ? e.media_position : void 0,
    duration: typeof e.media_duration == "number" ? e.media_duration : void 0,
    positionUpdatedAt: n ? Date.parse(n) : void 0
  };
}
function yt(t) {
  if (t.position == null) return;
  if (t.state !== "playing" || !t.positionUpdatedAt) return t.position;
  const e = t.position + (Date.now() - t.positionUpdatedAt) / 1e3;
  return t.duration != null ? Math.min(e, t.duration) : e;
}
function vt(t) {
  if (!t) return [];
  let e = t.attributes.data ?? t.attributes.items ?? t.attributes.entries;
  if (typeof e == "string")
    try {
      e = JSON.parse(e);
    } catch {
      return [];
    }
  return Array.isArray(e) ? e.filter((i) => i && typeof i == "object" && !("title_default" in i) && (i.title || i.name)).map((i) => {
    const s = i.added ?? i.aired ?? i.release ?? i.airdate;
    let r;
    if (typeof s == "number") r = s < 1e12 ? s * 1e3 : s;
    else if (typeof s == "string") {
      const a = Date.parse(s);
      r = Number.isFinite(a) ? a : void 0;
    }
    const n = i.number ?? (i.season != null && i.episode != null ? `S${i.season} · E${i.episode}` : void 0);
    return {
      title: i.title ?? i.name,
      subline: [n, i.episode_title ?? i.episode_name].filter(Boolean).join(" · ") || (i.year ? String(i.year) : void 0),
      poster: i.poster ?? i.thumb ?? i.image ?? i.fanart,
      added: r,
      type: i.type ?? (n ? "episode" : "movie")
    };
  }) : [];
}
const X = (t) => t.replace(/\/+$/, "");
function xt(t, e, i, s = 320, r = 480) {
  return `${X(t)}/photo/:/transcode?width=${s}&height=${r}&minSize=1&upscale=1&url=${encodeURIComponent(i)}&X-Plex-Token=${encodeURIComponent(e)}`;
}
async function $t(t, e, i) {
  var l;
  const s = `${X(t)}/library/recentlyAdded?X-Plex-Container-Start=0&X-Plex-Container-Size=${i}&X-Plex-Token=${encodeURIComponent(e)}`, r = await fetch(s, { headers: { Accept: "application/json" } });
  if (!r.ok) throw new Error(`Plex ${r.status}`);
  const n = await r.json();
  return (((l = n == null ? void 0 : n.MediaContainer) == null ? void 0 : l.Metadata) ?? []).slice(0, i).map((o) => {
    const d = o.type === "episode" || o.type === "season", h = (d ? o.grandparentTitle ?? o.parentTitle : o.title) ?? o.title ?? "", g = o.type === "episode" && o.parentIndex != null && o.index != null ? `S${o.parentIndex} · E${o.index}` : o.type === "season" ? o.title : void 0, u = (d ? o.grandparentThumb ?? o.parentThumb ?? o.thumb : o.thumb) ?? o.thumb;
    return {
      title: h,
      subline: g ?? (o.year ? String(o.year) : void 0),
      poster: u ? xt(t, e, u) : void 0,
      added: o.addedAt ? o.addedAt * 1e3 : void 0,
      type: o.type
    };
  });
}
async function wt(t, e, i, s) {
  const r = X(t), n = s ? `${r}/Users/${encodeURIComponent(s)}/Items/Latest?Limit=${i}&Fields=DateCreated` : `${r}/Items?SortBy=DateCreated&SortOrder=Descending&Recursive=true&Limit=${i}&IncludeItemTypes=Movie,Series,Episode&Fields=DateCreated`, a = await fetch(n, {
    headers: { Accept: "application/json", "X-Emby-Token": e }
  });
  if (!a.ok) throw new Error(`Jellyfin ${a.status}`);
  const l = await a.json();
  return (Array.isArray(l) ? l : (l == null ? void 0 : l.Items) ?? []).slice(0, i).map((d) => {
    var S, ue;
    const h = d.Type === "Episode", g = h && d.SeriesPrimaryImageTag ? d.SeriesId : d.Id, u = h && d.SeriesPrimaryImageTag ? d.SeriesPrimaryImageTag : (S = d.ImageTags) == null ? void 0 : S.Primary, b = h && d.ParentIndexNumber != null && d.IndexNumber != null ? `S${d.ParentIndexNumber} · E${d.IndexNumber}` : void 0;
    return {
      title: (h ? d.SeriesName : d.Name) ?? d.Name ?? "",
      subline: b ?? (d.ProductionYear ? String(d.ProductionYear) : void 0),
      poster: u ? `${r}/Items/${g}/Images/Primary?maxWidth=320&tag=${u}&api_key=${encodeURIComponent(e)}` : void 0,
      added: d.DateCreated ? Date.parse(d.DateCreated) : void 0,
      type: (ue = d.Type) == null ? void 0 : ue.toLowerCase()
    };
  });
}
async function kt(t, e) {
  const i = await fetch(`${X(t)}/api/v1/request/count`, {
    headers: { Accept: "application/json", "X-Api-Key": e }
  });
  if (!i.ok) throw new Error(`Overseerr ${i.status}`);
  return await i.json();
}
async function Ce(t, e, i) {
  const s = /* @__PURE__ */ new Date(), r = new Date(s.getTime() - i * 36e5), n = await t.callWS({
    type: "history/history_during_period",
    start_time: r.toISOString(),
    end_time: s.toISOString(),
    entity_ids: [e],
    minimal_response: !0,
    no_attributes: !0
  });
  return ((n == null ? void 0 : n[e]) ?? []).map((a) => ({ t: a.lu * 1e3, v: parseFloat(a.s) })).filter((a) => Number.isFinite(a.v));
}
async function St(t, e, i) {
  const s = /* @__PURE__ */ new Date();
  s.setHours(0, 0, 0, 0), s.setDate(s.getDate() - (i - 1));
  const r = await t.callWS({
    type: "recorder/statistics_during_period",
    start_time: s.toISOString(),
    end_time: (/* @__PURE__ */ new Date()).toISOString(),
    statistic_ids: [e],
    period: "day",
    types: ["max", "mean"]
  });
  return ((r == null ? void 0 : r[e]) ?? []).map((n) => ({
    t: typeof n.start == "number" ? n.start : Date.parse(String(n.start)),
    v: typeof n.max == "number" ? n.max : typeof n.mean == "number" ? n.mean : NaN
  })).filter((n) => Number.isFinite(n.t) && Number.isFinite(n.v));
}
async function Fe(t, e, i) {
  if (i <= 168) return Ce(t, e, i);
  const s = await St(t, e, i / 24).catch(
    () => []
  );
  return s.length ? s : Ce(t, e, i);
}
function qe(t, e, i) {
  const s = Date.now(), r = s - e * 36e5, n = new Array(i).fill(NaN), a = [...t].sort((d, h) => d.t - h.t);
  let l = 0;
  for (const d of a)
    if (d.t < r) l = d.v;
    else {
      const h = Math.min(i - 1, Math.floor((d.t - r) / (s - r) * i));
      n[h] = Number.isFinite(n[h]) ? Math.max(n[h], d.v) : d.v;
    }
  let o = l;
  for (let d = 0; d < i; d++)
    Number.isFinite(n[d]) ? o = n[d] : n[d] = o;
  return n;
}
function Ke(t, e) {
  const s = e.height ?? 110, r = e.grid ? 16 : 2, n = Math.max(2, Math.ceil(Math.max(...t, 0))), a = t.length, l = (u) => a > 1 ? u / (a - 1) * 480 : 0, o = (u) => (s - r) * (1 - Math.max(0, u) / n) + 2;
  let d = `M0 ${o(t[0] ?? 0)}`;
  for (let u = 1; u < a; u++) d += ` L${l(u)} ${o(t[u - 1])} L${l(u)} ${o(t[u])}`;
  const h = `${d} L480 ${s - r} L0 ${s - r} Z`, g = [];
  if (e.grid) {
    const u = n <= 6 ? 1 : Math.ceil(n / 4);
    for (let b = u; b <= n; b += u) g.push(b);
  }
  return c`
    <svg viewBox="0 0 ${480} ${s}" preserveAspectRatio="none">
      <defs>
        <linearGradient id=${e.id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color=${e.accent} stop-opacity="0.45" />
          <stop offset="1" stop-color=${e.accent} stop-opacity="0.02" />
        </linearGradient>
      </defs>
      ${g.map(
    (u) => re`<line class="grid" x1="0" y1=${o(u)} x2=${480} y2=${o(u)} />
          <text class="gridlabel" x="4" y=${o(u) - 3}>${u}</text>`
  )}
      <path d=${h} fill="url(#${e.id})" />
      <path d=${d} fill="none" stroke=${e.accent} stroke-width="2" vector-effect="non-scaling-stroke" />
      ${e.dot !== !1 ? re`<circle cx=${480} cy=${o(t[a - 1] ?? 0)} r="3.5" fill=${e.accent} />` : At()}
    </svg>
  `;
}
function At() {
  return re``;
}
const Pe = {
  plex: { accent: "#e5a00d", accent2: "#f7c247", match: "plex" },
  jellyfin: { accent: "#a85cc3", accent2: "#00a4dc", match: "jellyfin" },
  emby: { accent: "#52b54b", accent2: "#7fd478", match: "emby" },
  tautulli: { accent: "#dba81a", accent2: "#889df1", match: "plex" },
  neutral: {
    accent: "var(--primary-color)",
    accent2: "var(--accent-color, var(--primary-color))",
    match: "plex"
  }
};
function oe(t, e) {
  const i = Pe[t ?? "plex"] ?? Pe.plex;
  return e ? { ...i, accent: e, accent2: e } : i;
}
var Et = Object.defineProperty, Ct = Object.getOwnPropertyDescriptor, Q = (t, e, i, s) => {
  for (var r = s > 1 ? void 0 : s ? Ct(e, i) : e, n = t.length - 1, a; n >= 0; n--)
    (a = t[n]) && (r = (s ? a(e, i, r) : a(r)) || r);
  return s && r && Et(e, i, r), r;
};
const Pt = [
  "now_playing",
  "stats",
  "recently_added",
  "activity",
  "top",
  "requests",
  "custom"
], Nt = {
  now_playing: "mdi:play-box-multiple",
  stats: "mdi:bookshelf",
  recently_added: "mdi:new-box",
  activity: "mdi:chart-areaspline",
  top: "mdi:trophy-outline",
  requests: "mdi:message-plus-outline",
  custom: "mdi:gauge"
}, Tt = ["stats", "top", "requests", "custom"], Ne = {
  en: {
    title: "Title",
    subtitle: "Subtitle",
    brand: "Brand (accent + discovery)",
    brand_plex: "Plex",
    brand_jellyfin: "Jellyfin",
    brand_emby: "Emby",
    brand_tautulli: "Tautulli",
    brand_neutral: "Neutral (theme color)",
    accent: "Accent color (overrides brand)",
    card_style: "Style",
    style_default: "Default",
    style_glass: "Liquid Glass",
    style_material: "Material You",
    style_bubble: "Bubble",
    style_mirror: "Magic Mirror",
    status_entity: "Server status entity (online dot)",
    background: "Card background",
    flush: "Edge to edge (no outer padding)",
    collapsed: "Minimal mode (peek + tap for popup)",
    add_section: "Add section",
    section_title: "Heading (empty = hidden)",
    icon: "Icon",
    type: "Type",
    players: "Media players (empty = auto-discover)",
    match: "Auto-discover filter (entity id contains …)",
    layout: "Layout",
    layout_full: "Poster cards (backdrop)",
    layout_compact: "Compact rows",
    show_idle: "Show placeholder when idle",
    count_entity: "Stream count sensor (Tautulli)",
    direct_entity: "Direct-play count sensor",
    transcode_entity: "Transcode count sensor",
    bandwidth_entity: "Bandwidth sensor (kbps)",
    columns: "Columns",
    entity: "Entity",
    name: "Name",
    format: "Format",
    fmt_auto: "Auto",
    fmt_number: "Number",
    fmt_bytes: "Bytes (GB/TB)",
    fmt_duration: "Duration (min → h)",
    fmt_text: "Text",
    add_row: "Add entity",
    ra_source: "Source",
    ra_sensor: "Sensor (upcoming-media-card format)",
    ra_api: "Direct API (URL + token)",
    api: "API",
    url: "Server URL (e.g. http://192.168.1.10:32400)",
    token: "Token / API key",
    user_id: "Jellyfin user id (optional)",
    limit: "Items",
    hours: "Time window (hours)",
    color: "Chart color (optional)",
    seerr_hint: "Either sensors below, or URL + API key of Overseerr/Jellyseerr."
  },
  de: {
    title: "Titel",
    subtitle: "Untertitel",
    brand: "Marke (Akzent + Auto-Erkennung)",
    brand_plex: "Plex",
    brand_jellyfin: "Jellyfin",
    brand_emby: "Emby",
    brand_tautulli: "Tautulli",
    brand_neutral: "Neutral (Theme-Farbe)",
    accent: "Akzentfarbe (überschreibt Marke)",
    card_style: "Stil",
    style_default: "Standard",
    style_glass: "Liquid Glass",
    style_material: "Material You",
    style_bubble: "Bubble",
    style_mirror: "Magic Mirror",
    status_entity: "Server-Status-Entität (Online-Punkt)",
    background: "Kartenhintergrund",
    flush: "Randlos (kein Außenabstand)",
    collapsed: "Minimal-Modus (Vorschau + Tipp öffnet Popup)",
    add_section: "Sektion hinzufügen",
    section_title: "Überschrift (leer = ausblenden)",
    icon: "Icon",
    type: "Typ",
    players: "Media Player (leer = automatisch erkennen)",
    match: "Auto-Erkennung: Entity-ID enthält …",
    layout: "Layout",
    layout_full: "Poster-Karten (Backdrop)",
    layout_compact: "Kompakte Zeilen",
    show_idle: "Platzhalter zeigen, wenn nichts läuft",
    count_entity: "Stream-Anzahl-Sensor (Tautulli)",
    direct_entity: "Direct-Play-Anzahl-Sensor",
    transcode_entity: "Transkodierungs-Anzahl-Sensor",
    bandwidth_entity: "Bandbreiten-Sensor (kbps)",
    columns: "Spalten",
    entity: "Entität",
    name: "Name",
    format: "Format",
    fmt_auto: "Automatisch",
    fmt_number: "Zahl",
    fmt_bytes: "Bytes (GB/TB)",
    fmt_duration: "Dauer (min → h)",
    fmt_text: "Text",
    add_row: "Entität hinzufügen",
    ra_source: "Quelle",
    ra_sensor: "Sensor (upcoming-media-card-Format)",
    ra_api: "Direkte API (URL + Token)",
    api: "API",
    url: "Server-URL (z. B. http://192.168.1.10:32400)",
    token: "Token / API-Schlüssel",
    user_id: "Jellyfin-Benutzer-ID (optional)",
    limit: "Einträge",
    hours: "Zeitfenster (Stunden)",
    color: "Diagrammfarbe (optional)",
    seerr_hint: "Entweder Sensoren unten, oder URL + API-Key von Overseerr/Jellyseerr."
  }
};
let O = class extends $ {
  constructor() {
    super(...arguments), this._expanded = -1;
  }
  setConfig(t) {
    this._config = { ...t, sections: t.sections ?? [] };
  }
  _label(t) {
    var i;
    const e = je(this.hass);
    return ((i = Ne[e]) == null ? void 0 : i[t]) ?? Ne.en[t] ?? t;
  }
  _emit(t) {
    this._config = t, this.dispatchEvent(
      new CustomEvent("config-changed", {
        detail: { config: t },
        bubbles: !0,
        composed: !0
      })
    );
  }
  /* ---- top level -------------------------------------------------------- */
  _topSchema() {
    const t = (e, i) => e.map((s) => ({ value: s, label: this._label(`${i}_${s}`) }));
    return [
      {
        type: "grid",
        name: "",
        schema: [
          { name: "title", selector: { text: {} } },
          { name: "subtitle", selector: { text: {} } },
          {
            name: "brand",
            selector: {
              select: {
                mode: "dropdown",
                options: t(["plex", "jellyfin", "emby", "tautulli", "neutral"], "brand")
              }
            }
          },
          {
            name: "card_style",
            selector: {
              select: {
                mode: "dropdown",
                options: t(["default", "glass", "material", "bubble", "mirror"], "style")
              }
            }
          }
        ]
      },
      { name: "status_entity", selector: { entity: {} } },
      { name: "accent", selector: { text: {} } },
      { name: "collapsed", selector: { boolean: {} } },
      {
        type: "grid",
        name: "",
        schema: [
          { name: "background", selector: { boolean: {} } },
          { name: "flush", selector: { boolean: {} } }
        ]
      }
    ];
  }
  _topChanged(t) {
    if (t.stopPropagation(), !this._config) return;
    const e = t.detail.value, i = { ...this._config, ...e };
    for (const s of ["title", "subtitle", "accent", "status_entity"])
      (i[s] === "" || i[s] === void 0) && delete i[s];
    i.brand === "plex" && delete i.brand, i.card_style === "default" && delete i.card_style, i.background === !0 && delete i.background, i.flush === !1 && delete i.flush, i.collapsed === !1 && delete i.collapsed, this._emit(i);
  }
  /* ---- sections --------------------------------------------------------- */
  _sectionSchema(t) {
    const e = t.type, i = [
      {
        type: "grid",
        name: "",
        schema: [
          {
            name: "type",
            selector: {
              select: {
                mode: "dropdown",
                options: Pt.map((s) => ({ value: s, label: m(this.hass, s) }))
              }
            }
          },
          { name: "title", selector: { text: {} } }
        ]
      }
    ];
    switch (e) {
      case "now_playing":
        return [
          ...i,
          { name: "players", selector: { entity: { multiple: !0, domain: "media_player" } } },
          { name: "match", selector: { text: {} } },
          {
            type: "grid",
            name: "",
            schema: [
              {
                name: "layout",
                selector: {
                  select: {
                    mode: "dropdown",
                    options: [
                      { value: "full", label: this._label("layout_full") },
                      { value: "compact", label: this._label("layout_compact") }
                    ]
                  }
                }
              },
              { name: "show_idle", selector: { boolean: {} } },
              { name: "count_entity", selector: { entity: {} } },
              { name: "bandwidth_entity", selector: { entity: {} } },
              { name: "direct_entity", selector: { entity: {} } },
              { name: "transcode_entity", selector: { entity: {} } }
            ]
          }
        ];
      case "recently_added":
        return [
          ...i,
          { name: "entity", selector: { entity: {} } },
          {
            type: "grid",
            name: "",
            schema: [
              {
                name: "api",
                selector: {
                  select: {
                    mode: "dropdown",
                    options: [
                      { value: "plex", label: "Plex" },
                      { value: "jellyfin", label: "Jellyfin" }
                    ]
                  }
                }
              },
              { name: "limit", selector: { number: { min: 3, max: 30, mode: "box" } } }
            ]
          },
          { name: "url", selector: { text: {} } },
          { name: "token", selector: { text: {} } },
          ...t.api === "jellyfin" ? [{ name: "user_id", selector: { text: {} } }] : []
        ];
      case "activity":
        return [
          ...i,
          { name: "entity", selector: { entity: {} } },
          {
            type: "grid",
            name: "",
            schema: [
              { name: "hours", selector: { number: { min: 3, max: 168, mode: "box" } } },
              { name: "color", selector: { text: {} } }
            ]
          }
        ];
      case "requests":
        return [
          ...i,
          { name: "url", selector: { text: {} } },
          { name: "token", selector: { text: {} } },
          { name: "columns", selector: { number: { min: 1, max: 4, mode: "box" } } }
        ];
      default:
        return [
          ...i,
          ...e === "stats" || e === "custom" ? [{ name: "columns", selector: { number: { min: 1, max: 4, mode: "box" } } }] : []
        ];
    }
  }
  _sectionChanged(t, e) {
    if (t.stopPropagation(), !this._config) return;
    const i = t.detail.value, s = { ...this._config.sections[e], ...i };
    for (const [n, a] of Object.entries(s))
      (a === "" || a === void 0) && delete s[n];
    i.title === "" && this._config.sections[e].title && (s.title = "");
    const r = [...this._config.sections];
    r[e] = s, this._emit({ ...this._config, sections: r });
  }
  /* ---- row list (stats/top/requests/custom entities) --------------------- */
  _rows(t) {
    return ((t.type === "stats" || t.type === "custom" ? t.stats ?? t.entities : t.entities ?? t.stats) ?? []).map((i) => typeof i == "string" ? { entity: i } : i);
  }
  _rowKey(t) {
    return (t.type === "stats" || t.type === "custom") && !t.entities ? "stats" : "entities";
  }
  _rowSchema() {
    return [
      { name: "entity", selector: { entity: {} } },
      {
        type: "grid",
        name: "",
        schema: [
          { name: "name", selector: { text: {} } },
          { name: "icon", selector: { icon: {} } },
          {
            name: "format",
            selector: {
              select: {
                mode: "dropdown",
                options: [
                  { value: "auto", label: this._label("fmt_auto") },
                  { value: "number", label: this._label("fmt_number") },
                  { value: "bytes", label: this._label("fmt_bytes") },
                  { value: "duration", label: this._label("fmt_duration") },
                  { value: "text", label: this._label("fmt_text") }
                ]
              }
            }
          }
        ]
      }
    ];
  }
  _rowChanged(t, e, i) {
    if (t.stopPropagation(), !this._config) return;
    const s = t.detail.value, r = {};
    s.entity && (r.entity = s.entity), s.name && (r.name = s.name), s.icon && (r.icon = s.icon), s.format && s.format !== "auto" && (r.format = s.format);
    const n = this._config.sections[e], a = this._rowKey(n), l = [...this._rows(n)];
    l[i] = Object.keys(r).length === 1 && r.entity ? r.entity : r;
    const o = [...this._config.sections];
    o[e] = { ...n, [a]: l }, this._emit({ ...this._config, sections: o });
  }
  _addRow(t) {
    if (!this._config) return;
    const e = this._config.sections[t], i = this._rowKey(e), s = [...this._rows(e), { entity: "" }], r = [...this._config.sections];
    r[t] = { ...e, [i]: s }, this._emit({ ...this._config, sections: r });
  }
  _removeRow(t, e) {
    if (!this._config) return;
    const i = this._config.sections[t], s = this._rowKey(i), r = this._rows(i).filter((a, l) => l !== e), n = [...this._config.sections];
    n[t] = { ...i, [s]: r }, this._emit({ ...this._config, sections: n });
  }
  /* ---- add / move / remove sections -------------------------------------- */
  _addSection() {
    if (!this._config) return;
    const t = [...this._config.sections, { type: "stats" }];
    this._emit({ ...this._config, sections: t }), this._expanded = t.length - 1;
  }
  _move(t, e, i) {
    if (t.stopPropagation(), !this._config) return;
    const s = [...this._config.sections], r = e + i;
    r < 0 || r >= s.length || ([s[e], s[r]] = [s[r], s[e]], this._emit({ ...this._config, sections: s }), this._expanded = r);
  }
  _remove(t, e) {
    if (t.stopPropagation(), !this._config) return;
    const i = this._config.sections.filter((s, r) => r !== e);
    this._emit({ ...this._config, sections: i }), this._expanded === e && (this._expanded = -1);
  }
  /* ---- render ------------------------------------------------------------- */
  render() {
    return !this.hass || !this._config ? p : c`
      <ha-form
        .hass=${this.hass}
        .data=${{ brand: "plex", card_style: "default", background: !0, flush: !1, collapsed: !1, ...this._config }}
        .schema=${this._topSchema()}
        .computeLabel=${(t) => this._label(t.name)}
        @value-changed=${this._topChanged}
      ></ha-form>

      <div class="sections">
        ${this._config.sections.map((t, e) => this._renderSectionEditor(t, e))}
      </div>

      <button class="add" @click=${this._addSection}>
        <ha-icon icon="mdi:plus"></ha-icon>
        ${this._label("add_section")}
      </button>
    `;
  }
  _renderSectionEditor(t, e) {
    const i = this._expanded === e, s = this._config.sections.length;
    return c`
      <div class="section ${i ? "open" : ""}">
        <div class="section-head" @click=${() => this._expanded = i ? -1 : e}>
          <span class="chip"><ha-icon .icon=${t.icon ?? Nt[t.type] ?? "mdi:card"}></ha-icon></span>
          <span class="section-title">
            ${t.title || m(this.hass, t.type)}
            <span class="section-type">${t.type}</span>
          </span>
          <button class="icon-btn" .disabled=${e === 0} title="↑" @click=${(r) => this._move(r, e, -1)}>
            <ha-icon icon="mdi:chevron-up"></ha-icon>
          </button>
          <button class="icon-btn" .disabled=${e === s - 1} title="↓" @click=${(r) => this._move(r, e, 1)}>
            <ha-icon icon="mdi:chevron-down"></ha-icon>
          </button>
          <button class="icon-btn danger" @click=${(r) => this._remove(r, e)}>
            <ha-icon icon="mdi:delete-outline"></ha-icon>
          </button>
          <ha-icon class="expand" icon=${i ? "mdi:chevron-up" : "mdi:chevron-down"}></ha-icon>
        </div>
        ${i ? c`<div class="section-body">
              ${t.type === "requests" ? c`<div class="hint">${this._label("seerr_hint")}</div>` : p}
              <ha-form
                .hass=${this.hass}
                .data=${{ layout: "full", show_idle: !0, api: "plex", ...t }}
                .schema=${this._sectionSchema(t)}
                .computeLabel=${(r) => r.name === "title" ? this._label("section_title") : this._label(r.name)}
                @value-changed=${(r) => this._sectionChanged(r, e)}
              ></ha-form>
              ${Tt.includes(t.type) ? this._renderRowEditor(t, e) : p}
            </div>` : p}
      </div>
    `;
  }
  _renderRowEditor(t, e) {
    const i = this._rows(t);
    return c`
      <div class="sub-editor">
        ${i.map(
      (s, r) => c`
            <div class="sub-row">
              <ha-form
                .hass=${this.hass}
                .data=${{ format: "auto", ...s }}
                .schema=${this._rowSchema()}
                .computeLabel=${(n) => this._label(n.name)}
                @value-changed=${(n) => this._rowChanged(n, e, r)}
              ></ha-form>
              <button class="icon-btn danger" title="✕" @click=${() => this._removeRow(e, r)}>
                <ha-icon icon="mdi:delete-outline"></ha-icon>
              </button>
            </div>
          `
    )}
        <button class="add small" @click=${() => this._addRow(e)}>
          <ha-icon icon="mdi:plus"></ha-icon>
          ${this._label("add_row")}
        </button>
      </div>
    `;
  }
};
O.styles = de`
    .sections {
      margin-top: 16px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .section {
      border: 1px solid var(--divider-color);
      border-radius: 12px;
      overflow: hidden;
    }
    .section.open {
      border-color: var(--primary-color);
    }
    .section-head {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 12px;
      cursor: pointer;
      user-select: none;
    }
    .chip {
      width: 32px;
      height: 32px;
      border-radius: 9px;
      flex: none;
      display: grid;
      place-items: center;
      background: color-mix(in srgb, #e5a00d 18%, transparent);
      color: #e5a00d;
    }
    .chip ha-icon {
      --mdc-icon-size: 18px;
    }
    .section-title {
      flex: 1;
      min-width: 0;
      font-weight: 600;
      display: flex;
      flex-direction: column;
    }
    .section-type {
      font-size: 0.72rem;
      font-weight: 400;
      color: var(--secondary-text-color);
    }
    .icon-btn {
      border: none;
      background: none;
      padding: 4px;
      cursor: pointer;
      color: var(--secondary-text-color);
      border-radius: 6px;
      display: grid;
      place-items: center;
    }
    .icon-btn:hover {
      background: color-mix(in srgb, var(--primary-text-color) 8%, transparent);
    }
    .icon-btn[disabled] {
      opacity: 0.3;
      cursor: default;
    }
    .icon-btn.danger:hover {
      color: var(--error-color);
    }
    .icon-btn ha-icon {
      --mdc-icon-size: 18px;
    }
    .expand {
      color: var(--secondary-text-color);
      --mdc-icon-size: 20px;
    }
    .section-body {
      padding: 4px 12px 14px;
      border-top: 1px solid var(--divider-color);
    }
    .hint {
      font-size: 0.78rem;
      color: var(--secondary-text-color);
      padding: 8px 0 4px;
    }
    .add {
      margin-top: 12px;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 8px 14px;
      border-radius: 10px;
      border: 1px dashed var(--divider-color);
      background: none;
      color: var(--primary-text-color);
      cursor: pointer;
      font: inherit;
    }
    .add:hover {
      border-color: var(--primary-color);
      color: var(--primary-color);
    }
    .add.small {
      margin-top: 8px;
      padding: 6px 10px;
      font-size: 0.85rem;
    }
    .sub-editor {
      margin-top: 10px;
      padding-top: 8px;
      border-top: 1px dashed var(--divider-color);
    }
    .sub-row {
      display: flex;
      align-items: flex-start;
      gap: 6px;
      margin-bottom: 10px;
    }
    .sub-row ha-form {
      flex: 1;
      min-width: 0;
    }
  `;
Q([
  q({ attribute: !1 })
], O.prototype, "hass", 2);
Q([
  _()
], O.prototype, "_config", 2);
Q([
  _()
], O.prototype, "_expanded", 2);
O = Q([
  Z("plexglass-card-editor")
], O);
var Mt = Object.defineProperty, zt = Object.getOwnPropertyDescriptor, w = (t, e, i, s) => {
  for (var r = s > 1 ? void 0 : s ? zt(e, i) : e, n = t.length - 1, a; n >= 0; n--)
    (a = t[n]) && (r = (s ? a(e, i, r) : a(r)) || r);
  return s && r && Mt(e, i, r), r;
};
const Rt = ["default", "glass", "material", "bubble", "mirror"], Ot = 32, Dt = 5 * 60 * 1e3;
let N = class extends $ {
  constructor() {
    super(...arguments), this._sparkAt = 0, this._busy = !1;
  }
  setConfig(t) {
    this._config = t, this._spark = void 0, this._sparkAt = 0;
  }
  getCardSize() {
    return 1;
  }
  static getConfigElement() {
    return document.createElement("plexglass-mini-card-editor");
  }
  static getStubConfig(t) {
    const i = Object.keys((t == null ? void 0 : t.states) ?? {}).find(
      (s) => s.includes("tautulli") && s.includes("stream_count") && !s.includes("direct") && !s.includes("transcode")
    );
    return { title: "Plex", brand: "plex", ...i ? { count_entity: i } : {} };
  }
  updated(t) {
    if (super.updated(t), !this.hass || !this._config) return;
    const e = this._sparkEntity();
    if (!e) return;
    const i = Date.now();
    if (this._busy || this._spark && i - this._sparkAt < Dt) return;
    this._busy = !0;
    const s = this._config.hours ?? 24;
    Fe(this.hass, e, s).then((r) => {
      this._spark = qe(r, s, Ot), this._sparkAt = Date.now(), this._busy = !1;
    }).catch(() => {
      this._busy = !1, this._sparkAt = Date.now();
    });
  }
  _sparkEntity() {
    var t, e;
    return ((t = this._config) == null ? void 0 : t.entity) ?? ((e = this._config) == null ? void 0 : e.count_entity);
  }
  _num(t) {
    if (!t) return NaN;
    const e = this.hass.states[t];
    return e ? typeof e.state == "number" ? e.state : parseFloat(e.state) : NaN;
  }
  _count() {
    const t = this._config, e = this._num(t.count_entity);
    return Number.isFinite(e) ? e : I(this.hass, { match: t.match }, oe(t.brand).match).length;
  }
  _cardStyle() {
    var e;
    const t = ((e = this._config) == null ? void 0 : e.card_style) ?? "default";
    return Rt.includes(t) ? t : "default";
  }
  _moreInfo() {
    var e, i;
    const t = ((e = this._config) == null ? void 0 : e.count_entity) ?? ((i = this._config) == null ? void 0 : i.entity);
    t && this.dispatchEvent(new CustomEvent("hass-more-info", { detail: { entityId: t }, bubbles: !0, composed: !0 }));
  }
  render() {
    if (!this.hass || !this._config) return p;
    const t = this._config, e = oe(t.brand, t.accent), i = this._count(), s = this._num(t.direct_entity), r = this._num(t.transcode_entity), n = this._num(t.bandwidth_entity), a = t.status_entity ? this.hass.states[t.status_entity] : void 0, l = a ? !["off", "unavailable", "unknown", "0"].includes(a.state) : void 0, o = Number.isFinite(i) && i > 0, d = ["mini", `s-${this._cardStyle()}`].join(" "), h = `--pg-accent:${e.accent};--pg-accent2:${e.accent2};`, g = c`
      <div class="mini-inner" @click=${() => this._moreInfo()}>
        <div class="brandmark ${o ? "" : "idle"}">
          <svg viewBox="0 0 24 24"><path d="M8 5.5v13l10-6.5z" /></svg>
        </div>
        <div class="mini-body">
          <div class="mini-top">
            <span class="mini-title">${t.title ?? "Plex"}</span>
            ${l !== void 0 ? c`<span class="statusdot ${l ? "on" : "off"}"></span>` : p}
          </div>
          <div class="mini-chips">
            ${Number.isFinite(s) && s > 0 ? c`<span class="mchip good"><ha-icon icon="mdi:play-speed"></ha-icon>${f(s, this.hass)}</span>` : p}
            ${Number.isFinite(r) && r > 0 ? c`<span class="mchip warn"><ha-icon icon="mdi:cog-transfer-outline"></ha-icon>${f(r, this.hass)}</span>` : p}
            ${Number.isFinite(n) && n > 0 ? c`<span class="mchip"><ha-icon icon="mdi:speedometer"></ha-icon>${Be(n, this.hass)}</span>` : p}
            ${o ? p : c`<span class="mchip">${m(this.hass, "nothing_playing")}</span>`}
          </div>
        </div>
        <div class="mini-count ${o ? "active" : ""}">
          <span class="mini-num">${Number.isFinite(i) ? f(i, this.hass) : "–"}</span>
          <span class="mini-unit">${i === 1 ? m(this.hass, "stream") : m(this.hass, "streams")}</span>
        </div>
      </div>
      ${this._spark && this._spark.some((u) => u > 0) ? c`<div class="mini-spark">
            ${Ke(this._spark, { id: "pg-mini-spark", accent: e.accent, height: 40, grid: !1, dot: !1 })}
          </div>` : p}
    `;
    return t.background === !1 ? c`<div class="${d} nobg" style=${h}>${g}</div>` : c`<ha-card class=${d} style=${h}>${g}</ha-card>`;
  }
};
N.styles = de`
    :host {
      --pg-accent: #e5a00d;
      --pg-accent2: #f7c247;
      --pg-card-bg: var(--ha-card-background, var(--card-background-color, #fff));
      --pg-tile-bg: color-mix(in srgb, var(--primary-text-color) 5%, transparent);
      --pg-text: var(--primary-text-color);
      --pg-text2: var(--secondary-text-color);
    }
    ha-card.mini,
    .mini.nobg {
      overflow: hidden;
      position: relative;
    }
    .mini-inner {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 14px;
      cursor: pointer;
    }
    .brandmark {
      width: 36px;
      height: 36px;
      border-radius: 11px;
      flex: none;
      display: grid;
      place-items: center;
      background: linear-gradient(135deg, var(--pg-accent), var(--pg-accent2));
      box-shadow: 0 4px 12px color-mix(in srgb, var(--pg-accent) 38%, transparent);
    }
    .brandmark.idle {
      background: var(--pg-tile-bg);
      box-shadow: none;
    }
    .brandmark svg {
      width: 20px;
      height: 20px;
      fill: #fff;
      filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.25));
    }
    .brandmark.idle svg {
      fill: var(--pg-text2);
      filter: none;
    }
    .mini-body {
      flex: 1;
      min-width: 0;
    }
    .mini-top {
      display: flex;
      align-items: center;
      gap: 7px;
    }
    .mini-title {
      font-size: 1rem;
      font-weight: 700;
      color: var(--pg-text);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .statusdot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      flex: none;
    }
    .statusdot.on {
      background: var(--success-color, #2e7d32);
      box-shadow: 0 0 0 3px color-mix(in srgb, var(--success-color, #2e7d32) 22%, transparent);
    }
    .statusdot.off {
      background: var(--error-color, #c62828);
    }
    .mini-chips {
      display: flex;
      gap: 5px;
      margin-top: 3px;
      flex-wrap: wrap;
    }
    .mchip {
      display: inline-flex;
      align-items: center;
      gap: 3px;
      padding: 2px 8px;
      border-radius: 999px;
      font-size: 0.72rem;
      font-weight: 600;
      color: var(--pg-text2);
      background: var(--pg-tile-bg);
      white-space: nowrap;
    }
    .mchip ha-icon {
      --mdc-icon-size: 13px;
    }
    .mchip.good {
      color: var(--success-color, #2e7d32);
      background: color-mix(in srgb, var(--success-color, #2e7d32) 14%, transparent);
    }
    .mchip.warn {
      color: var(--warning-color, #fb8c00);
      background: color-mix(in srgb, var(--warning-color, #fb8c00) 16%, transparent);
    }
    .mini-count {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      flex: none;
      line-height: 1;
    }
    .mini-num {
      font-size: 1.7rem;
      font-weight: 800;
      color: var(--pg-text2);
      font-variant-numeric: tabular-nums;
    }
    .mini-count.active .mini-num {
      color: transparent;
      background: linear-gradient(135deg, var(--pg-accent), var(--pg-accent2));
      -webkit-background-clip: text;
      background-clip: text;
    }
    .mini-unit {
      font-size: 0.64rem;
      text-transform: uppercase;
      letter-spacing: 0.07em;
      color: var(--pg-text2);
      margin-top: 3px;
    }
    .mini-spark {
      height: 40px;
      margin-top: -6px;
    }
    .mini-spark svg {
      display: block;
      width: 100%;
      height: 40px;
    }

    /* ---- styles ---- */
    .s-glass {
      --pg-tile-bg: color-mix(in srgb, var(--pg-card-bg) 42%, transparent);
    }
    ha-card.mini.s-glass {
      background: color-mix(in srgb, var(--pg-card-bg) 55%, transparent);
      -webkit-backdrop-filter: blur(18px) saturate(1.5);
      backdrop-filter: blur(18px) saturate(1.5);
    }
    .s-material .brandmark {
      border-radius: 13px;
    }
    ha-card.mini.s-material {
      border-radius: 24px;
    }
    ha-card.mini.s-bubble {
      box-shadow: var(--ha-card-box-shadow, 0 2px 8px rgba(0, 0, 0, 0.08));
    }
    .s-mirror {
      --pg-tile-bg: #000;
      --pg-text: #fff;
      --pg-text2: #bbb;
      color: #fff;
    }
    ha-card.mini.s-mirror {
      background: #000;
      box-shadow: none;
      border: none;
    }
    .s-mirror .brandmark {
      background: #000;
      border: 1px solid rgba(255, 255, 255, 0.4);
      box-shadow: none;
    }
    .s-mirror .brandmark svg {
      fill: #fff;
    }
    .s-mirror .mini-title {
      color: #fff;
    }
    .s-mirror .mchip {
      background: #000;
      border: 1px solid rgba(255, 255, 255, 0.3);
      color: #ddd;
    }
    .s-mirror .mini-count.active .mini-num {
      color: #fff;
      -webkit-background-clip: initial;
      background-clip: initial;
      background: none;
    }
  `;
w([
  q({ attribute: !1 })
], N.prototype, "hass", 2);
w([
  _()
], N.prototype, "_config", 2);
w([
  _()
], N.prototype, "_spark", 2);
w([
  _()
], N.prototype, "_sparkAt", 2);
N = w([
  Z("plexglass-mini-card")
], N);
const Te = {
  en: {
    title: "Title",
    brand: "Brand",
    accent: "Accent color (overrides brand)",
    card_style: "Style",
    count_entity: "Stream count sensor (empty = count players)",
    match: "Auto-discover filter",
    direct_entity: "Direct-play sensor",
    transcode_entity: "Transcode sensor",
    bandwidth_entity: "Bandwidth sensor (kbps)",
    entity: "Sparkline sensor (default: stream count)",
    hours: "Sparkline window (hours)",
    status_entity: "Server status entity",
    background: "Card background"
  },
  de: {
    title: "Titel",
    brand: "Marke",
    accent: "Akzentfarbe (überschreibt Marke)",
    card_style: "Stil",
    count_entity: "Stream-Anzahl-Sensor (leer = Player zählen)",
    match: "Auto-Erkennungs-Filter",
    direct_entity: "Direct-Play-Sensor",
    transcode_entity: "Transkodierungs-Sensor",
    bandwidth_entity: "Bandbreiten-Sensor (kbps)",
    entity: "Sparkline-Sensor (Standard: Stream-Anzahl)",
    hours: "Sparkline-Fenster (Stunden)",
    status_entity: "Server-Status-Entität",
    background: "Kartenhintergrund"
  }
}, It = ["plex", "jellyfin", "emby", "tautulli", "neutral"], Lt = ["default", "glass", "material", "bubble", "mirror"];
let Y = class extends $ {
  setConfig(t) {
    this._config = t;
  }
  _label(t) {
    var i, s, r, n;
    const e = (((s = (i = this.hass) == null ? void 0 : i.locale) == null ? void 0 : s.language) ?? ((r = this.hass) == null ? void 0 : r.language) ?? "en").split("-")[0];
    return ((n = Te[e]) == null ? void 0 : n[t]) ?? Te.en[t] ?? t;
  }
  _schema() {
    return [
      {
        type: "grid",
        name: "",
        schema: [
          { name: "title", selector: { text: {} } },
          {
            name: "brand",
            selector: { select: { mode: "dropdown", options: It.map((t) => ({ value: t, label: Me(t) })) } }
          },
          {
            name: "card_style",
            selector: { select: { mode: "dropdown", options: Lt.map((t) => ({ value: t, label: Me(t) })) } }
          },
          { name: "accent", selector: { text: {} } }
        ]
      },
      { name: "count_entity", selector: { entity: {} } },
      {
        type: "grid",
        name: "",
        schema: [
          { name: "direct_entity", selector: { entity: {} } },
          { name: "transcode_entity", selector: { entity: {} } },
          { name: "bandwidth_entity", selector: { entity: {} } },
          { name: "status_entity", selector: { entity: {} } }
        ]
      },
      { name: "entity", selector: { entity: {} } },
      {
        type: "grid",
        name: "",
        schema: [
          { name: "hours", selector: { number: { min: 3, max: 168, mode: "box" } } },
          { name: "match", selector: { text: {} } }
        ]
      },
      { name: "background", selector: { boolean: {} } }
    ];
  }
  _changed(t) {
    if (t.stopPropagation(), !this._config) return;
    const e = t.detail.value, i = { ...this._config, ...e };
    for (const [s, r] of Object.entries(i))
      (r === "" || r === void 0) && delete i[s];
    i.brand === "plex" && delete i.brand, i.card_style === "default" && delete i.card_style, i.background === !0 && delete i.background, this._config = i, this.dispatchEvent(
      new CustomEvent("config-changed", { detail: { config: i }, bubbles: !0, composed: !0 })
    );
  }
  render() {
    return !this.hass || !this._config ? p : c`
      <ha-form
        .hass=${this.hass}
        .data=${{ brand: "plex", card_style: "default", hours: 24, background: !0, ...this._config }}
        .schema=${this._schema()}
        .computeLabel=${(t) => this._label(t.name)}
        @value-changed=${this._changed}
      ></ha-form>
    `;
  }
};
w([
  q({ attribute: !1 })
], Y.prototype, "hass", 2);
w([
  _()
], Y.prototype, "_config", 2);
Y = w([
  Z("plexglass-mini-card-editor")
], Y);
function Me(t) {
  return t.charAt(0).toUpperCase() + t.slice(1);
}
window.customCards = window.customCards ?? [];
window.customCards.push({
  type: "plexglass-mini-card",
  name: "Plexglass Mini",
  description: "Compact current-activity badge: stream count, direct/transcode, bandwidth and a sparkline.",
  preview: !0
});
var Ut = Object.defineProperty, Ht = Object.getOwnPropertyDescriptor, k = (t, e, i, s) => {
  for (var r = s > 1 ? void 0 : s ? Ht(e, i) : e, n = t.length - 1, a; n >= 0; n--)
    (a = t[n]) && (r = (s ? a(e, i, r) : a(r)) || r);
  return s && r && Ut(e, i, r), r;
};
const jt = "0.2.0", Bt = ["default", "glass", "material", "bubble", "mirror"], Ft = 5 * 60 * 1e3, qt = 10 * 60 * 1e3, Kt = 5 * 60 * 1e3, Wt = 48, ze = [24, 168, 720, 2160];
let y = class extends $ {
  constructor() {
    super(...arguments), this._historyCache = {}, this._recentCache = {}, this._seerrCache = {}, this._range = {}, this._popup = !1, this._onKey = (t) => {
      t.key === "Escape" && this._closePopup();
    };
  }
  setConfig(t) {
    if (!t || !Array.isArray(t.sections) || !t.sections.length)
      throw new Error("plexglass-card: please define at least one section");
    this._config = t, this._historyCache = {}, this._recentCache = {}, this._seerrCache = {};
  }
  getCardSize() {
    var t;
    return 2 + (((t = this._config) == null ? void 0 : t.sections.length) ?? 0) * 2;
  }
  static getConfigElement() {
    return document.createElement("plexglass-card-editor");
  }
  static getStubConfig(t) {
    const i = Object.keys((t == null ? void 0 : t.states) ?? {}).find((r) => r.includes("tautulli") && r.includes("stream_count") && !r.includes("direct") && !r.includes("transcode")), s = [{ type: "now_playing", ...i ? { count_entity: i } : {} }];
    return i && s.push({ type: "activity", entity: i }), { title: "Plex", brand: "plex", sections: s };
  }
  disconnectedCallback() {
    super.disconnectedCallback(), window.removeEventListener("keydown", this._onKey), this._ticker && (clearInterval(this._ticker), this._ticker = void 0);
  }
  /* ---- data plumbing ---------------------------------------------------- */
  updated(t) {
    super.updated(t), !(!this.hass || !this._config) && (this._syncTicker(), this._maybeFetch());
  }
  /** 1 s re-render tick while something is playing (live progress bars) */
  _syncTicker() {
    var e;
    const t = (((e = this._config) == null ? void 0 : e.sections) ?? []).some(
      (i) => i.type === "now_playing" && I(this.hass, i, this._brand().match).some((s) => s.state === "playing")
    );
    t && !this._ticker ? this._ticker = window.setInterval(() => this.requestUpdate(), 1e3) : !t && this._ticker && (clearInterval(this._ticker), this._ticker = void 0);
  }
  _maybeFetch() {
    const t = Date.now();
    this._config.sections.forEach((e, i) => {
      if (e.type === "activity") {
        const s = this._activityEntity(e);
        if (!s) return;
        const r = this._activityHours(e, i), n = `${s}|${r}`, a = this._historyCache[n];
        if (a != null && a.busy || a && t - a.at < Ft) return;
        this._historyCache = { ...this._historyCache, [n]: { ...a, at: t, busy: !0 } }, Fe(this.hass, s, r).then((l) => {
          const o = qe(l, r, Wt);
          this._historyCache = { ...this._historyCache, [n]: { data: o, at: Date.now() } };
        }).catch(() => {
          this._historyCache = { ...this._historyCache, [n]: { error: !0, at: Date.now() } };
        });
      }
      if (e.type === "recently_added" && e.url && e.token) {
        const s = this._recentCache[i];
        if (s != null && s.busy || s && t - s.at < qt) return;
        this._recentCache = { ...this._recentCache, [i]: { ...s, at: t, busy: !0 } };
        const r = e.limit ?? 10;
        (e.api === "jellyfin" ? wt(e.url, e.token, r, e.user_id) : $t(e.url, e.token, r)).then((a) => {
          this._recentCache = { ...this._recentCache, [i]: { data: a, at: Date.now() } };
        }).catch(() => {
          this._recentCache = { ...this._recentCache, [i]: { ...this._recentCache[i], error: !0, busy: !1, at: Date.now() } };
        });
      }
      if (e.type === "requests" && e.url && e.token) {
        const s = this._seerrCache[i];
        if (s != null && s.busy || s && t - s.at < Kt) return;
        this._seerrCache = { ...this._seerrCache, [i]: { ...s, at: t, busy: !0 } }, kt(e.url, e.token).then((r) => {
          this._seerrCache = { ...this._seerrCache, [i]: { data: r, at: Date.now() } };
        }).catch(() => {
          this._seerrCache = { ...this._seerrCache, [i]: { ...this._seerrCache[i], error: !0, busy: !1, at: Date.now() } };
        });
      }
    });
  }
  _activityEntity(t) {
    var i;
    if (t.entity) return t.entity;
    const e = (i = this._config) == null ? void 0 : i.sections.find((s) => s.type === "now_playing" && s.count_entity);
    return e == null ? void 0 : e.count_entity;
  }
  /** range toggle options for an activity section (empty = no toggle) */
  _activityRanges(t) {
    return t.ranges ? t.ranges : t.hours && !ze.includes(t.hours) ? [] : ze;
  }
  /** currently selected window (hours) for an activity section */
  _activityHours(t, e) {
    if (this._range[e] != null) return this._range[e];
    const i = this._activityRanges(t);
    return t.hours ? t.hours : i[0] ?? 24;
  }
  /* ---- helpers ----------------------------------------------------------- */
  _brand() {
    var t, e;
    return oe((t = this._config) == null ? void 0 : t.brand, (e = this._config) == null ? void 0 : e.accent);
  }
  _cardStyle() {
    var e;
    const t = ((e = this._config) == null ? void 0 : e.card_style) ?? "default";
    return Bt.includes(t) ? t : "default";
  }
  _num(t, e) {
    if (!t) return NaN;
    const i = this.hass.states[t];
    if (!i) return NaN;
    const s = e ? i.attributes[e] : i.state;
    return typeof s == "number" ? s : parseFloat(s);
  }
  _stat(t) {
    return typeof t == "string" ? { entity: t } : t;
  }
  _statValue(t) {
    const e = this.hass.states[t.entity];
    if (!e) return "–";
    const i = t.attribute ? e.attributes[t.attribute] : e.state, s = typeof i == "number" ? i : parseFloat(i), r = t.unit ?? e.attributes.unit_of_measurement ?? "";
    switch (t.format ?? (Number.isFinite(s) ? "number" : "text")) {
      case "bytes":
        return mt(s, this.hass, r || "b");
      case "duration":
        return gt(s, this.hass);
      case "number":
        return `${f(s, this.hass)}${r ? ` ${r}` : ""}`;
      default:
        return String(i ?? "–");
    }
  }
  _statName(t) {
    if (t.name) return t.name;
    const e = this.hass.states[t.entity];
    return (e == null ? void 0 : e.attributes.friendly_name) ?? t.entity;
  }
  _moreInfo(t) {
    t && this.dispatchEvent(
      new CustomEvent("hass-more-info", {
        detail: { entityId: t },
        bubbles: !0,
        composed: !0
      })
    );
  }
  /* ---- render ------------------------------------------------------------ */
  render() {
    if (!this.hass || !this._config) return p;
    const t = this._config, e = this._brand(), i = ["cardroot", `s-${this._cardStyle()}`, t.flush ? "flush" : ""].join(" "), s = `--pg-accent:${e.accent};--pg-accent2:${e.accent2};`;
    if (t.collapsed)
      return c`
        ${t.background === !1 ? c`<div class="${i} collapsed nobg" style=${s}>${this._renderPeek()}</div>` : c`<ha-card class="${i} collapsed" style=${s}>${this._renderPeek()}</ha-card>`}
        ${this._popup ? this._renderPopup(s) : p}
      `;
    const r = c`
      ${this._renderHeader()}
      <div class="sections">${t.sections.map((n, a) => this._renderSection(n, a))}</div>
    `;
    return t.background === !1 ? c`<div class="${i} nobg" style=${s}>${r}</div>` : c`<ha-card class=${i} style=${s}>${r}</ha-card>`;
  }
  /* ---- collapsed (minimal) mode ----------------------------------------- */
  _renderPeek() {
    const t = this._config, e = t.sections.find((a) => a.type === "now_playing"), i = e ? I(this.hass, e, this._brand().match).map(Ee) : [], s = i.length > 0, r = t.status_entity ? this.hass.states[t.status_entity] : void 0, n = r ? !["off", "unavailable", "unknown", "0"].includes(r.state) : void 0;
    return c`
      <div class="peek" @click=${() => this._openPopup()}>
        <div class="brandmark ${s ? "" : "idle"}">
          <svg viewBox="0 0 24 24"><path d="M8 5.5v13l10-6.5z" /></svg>
        </div>
        <div class="peek-body">
          <div class="peek-top">
            <span class="peek-title">${t.title ?? "Plex"}</span>
            ${n !== void 0 ? c`<span class="statusdot ${n ? "on" : "off"}"></span>` : p}
            ${s ? c`<span class="peek-count">${i.length} ${i.length === 1 ? m(this.hass, "stream") : m(this.hass, "streams")}</span>` : p}
          </div>
          ${s ? c`<div class="peek-streams">
                ${i.map(
      (a) => c`<div class="peek-row">
                    <ha-icon
                      class="peek-state"
                      .icon=${a.state === "paused" ? "mdi:pause" : "mdi:play"}
                    ></ha-icon>
                    <span class="peek-name">${a.title}</span>
                    ${a.user ? c`<span class="peek-user">${a.user}</span>` : p}
                  </div>`
    )}
              </div>` : c`<div class="peek-idle">${m(this.hass, "nothing_playing")}</div>`}
        </div>
        <ha-icon class="peek-expand" icon="mdi:chevron-right"></ha-icon>
      </div>
    `;
  }
  _renderPopup(t) {
    const e = this._config;
    return c`
      <div
        class="pg-overlay s-${this._cardStyle()}"
        style=${t}
        @click=${(i) => {
      i.target === i.currentTarget && this._closePopup();
    }}
      >
        <div class="dialog" role="dialog" aria-modal="true">
          <div class="dialog-head">
            ${this._renderHeader()}
            <button class="dialog-close" @click=${() => this._closePopup()} aria-label="Close">
              <ha-icon icon="mdi:close"></ha-icon>
            </button>
          </div>
          <div class="dialog-body">
            <div class="sections">${e.sections.map((i, s) => this._renderSection(i, s))}</div>
          </div>
        </div>
      </div>
    `;
  }
  _openPopup() {
    this._popup = !0, window.addEventListener("keydown", this._onKey);
  }
  _closePopup() {
    this._popup = !1, window.removeEventListener("keydown", this._onKey);
  }
  _renderHeader() {
    const t = this._config;
    if (!t.title && !t.subtitle) return p;
    const e = t.status_entity ? this.hass.states[t.status_entity] : void 0, i = e ? !["off", "unavailable", "unknown", "0"].includes(e.state) : void 0;
    return c`
      <div class="header">
        <div class="brandmark">
          <svg viewBox="0 0 24 24"><path d="M8 5.5v13l10-6.5z" /></svg>
        </div>
        <div class="header-text">
          <div class="title">
            ${t.title}
            ${i !== void 0 ? c`<span
                  class="statusdot ${i ? "on" : "off"}"
                  title=${i ? m(this.hass, "online") : m(this.hass, "offline")}
                ></span>` : p}
          </div>
          ${t.subtitle ? c`<div class="subtitle">${t.subtitle}</div>` : p}
        </div>
        ${this._renderHeaderChips()}
      </div>
    `;
  }
  _renderHeaderChips() {
    const t = this._config.sections.find((s) => s.type === "now_playing");
    if (!t) return p;
    const e = Number.isFinite(this._num(t.count_entity)) ? this._num(t.count_entity) : I(this.hass, t, this._brand().match).length, i = this._num(t.bandwidth_entity);
    return c`
      <div class="header-chips">
        <span class="chip accented">
          <ha-icon icon="mdi:play-circle-outline"></ha-icon>
          ${f(e, this.hass)}
          ${e === 1 ? m(this.hass, "stream") : m(this.hass, "streams")}
        </span>
        ${Number.isFinite(i) && i > 0 ? c`<span class="chip">
              <ha-icon icon="mdi:speedometer"></ha-icon>
              ${Be(i, this.hass)}
            </span>` : p}
      </div>
    `;
  }
  _renderSection(t, e) {
    switch (t.type) {
      case "now_playing":
        return this._renderNowPlaying(t);
      case "stats":
      case "custom":
        return this._renderStats(t);
      case "recently_added":
        return this._renderRecent(t, e);
      case "activity":
        return this._renderActivity(t, e);
      case "top":
        return this._renderTop(t);
      case "requests":
        return this._renderRequests(t, e);
      default:
        return p;
    }
  }
  _sectionHead(t, e, i) {
    const s = t.title ?? m(this.hass, t.type);
    return s === "" ? p : c`
      <div class="sec-head">
        <ha-icon .icon=${t.icon ?? e}></ha-icon>
        <span class="sec-title">${s}</span>
        ${i ?? p}
      </div>
    `;
  }
  /* ---- now playing ------------------------------------------------------- */
  _renderNowPlaying(t) {
    const e = I(this.hass, t, this._brand().match).map(Ee), i = this._transcodeChips(t);
    return c`
      <div class="section">
        ${this._sectionHead(t, "mdi:play-box-multiple", i)}
        ${e.length ? c`<div class="streams">
              ${e.map(
      (s) => t.layout === "compact" ? this._streamRow(s) : this._streamCard(s)
    )}
            </div>` : t.show_idle === !1 ? p : c`<div class="idle">
                <ha-icon icon="mdi:filmstrip-off"></ha-icon>
                <div>
                  <div class="idle-title">${m(this.hass, "nothing_playing")}</div>
                  <div class="idle-hint">${m(this.hass, "idle_hint")}</div>
                </div>
              </div>`}
      </div>
    `;
  }
  _transcodeChips(t) {
    const e = this._num(t.direct_entity), i = this._num(t.transcode_entity);
    if (!(!Number.isFinite(e) && !Number.isFinite(i)))
      return c`<span class="sec-chips">
      ${Number.isFinite(e) ? c`<span class="chip good"
            ><ha-icon icon="mdi:play-speed"></ha-icon>${f(e, this.hass)}
            ${m(this.hass, "direct_play")}</span
          >` : p}
      ${Number.isFinite(i) ? c`<span class="chip ${i > 0 ? "warn" : ""}"
            ><ha-icon icon="mdi:cog-transfer-outline"></ha-icon>${f(i, this.hass)}
            ${m(this.hass, "transcode")}</span
          >` : p}
    </span>`;
  }
  _progress(t) {
    const e = yt(t);
    if (!(e == null || !t.duration))
      return { pct: Math.min(100, e / t.duration * 100), pos: e, left: t.duration - e };
  }
  _stateBadge(t) {
    return t.state === "paused" ? c`<span class="chip statechip"><ha-icon icon="mdi:pause"></ha-icon>${m(this.hass, "paused")}</span>` : t.state === "buffering" ? c`<span class="chip statechip"><ha-icon icon="mdi:timer-sand"></ha-icon>${m(this.hass, "buffering")}</span>` : p;
  }
  _avatar(t) {
    return t ? c`<span class="avatar" title=${t}>${t.slice(0, 1).toUpperCase()}</span>` : p;
  }
  _mediaIcon(t) {
    return t.mediaType === "music" ? "mdi:music" : t.mediaType === "episode" || t.mediaType === "tvshow" ? "mdi:television-classic" : "mdi:movie-open";
  }
  _streamCard(t) {
    const e = this._progress(t);
    return c`
      <div class="stream ${t.state}" @click=${() => this._moreInfo(t.entityId)}>
        ${t.poster ? c`<div class="backdrop" style="background-image:url('${t.poster}')"></div>` : p}
        <div class="stream-inner">
          ${t.poster ? c`<img class="poster" src=${t.poster} alt="" loading="lazy" />` : c`<div class="poster poster-empty"><ha-icon .icon=${this._mediaIcon(t)}></ha-icon></div>`}
          <div class="stream-info">
            <div class="stream-title">${t.title}</div>
            ${t.subline ? c`<div class="stream-sub">${t.subline}</div>` : p}
            <div class="stream-meta">
              ${this._avatar(t.user)}
              ${t.user ? c`<span class="username">${t.user}</span>` : p}
              ${t.device ? c`<span class="device"><ha-icon icon="mdi:monitor-small"></ha-icon>${t.device}</span>` : p}
              ${this._stateBadge(t)}
            </div>
            ${e ? c`
                  <div class="progress">
                    <div class="bar"><div class="fill" style="width:${e.pct}%"></div></div>
                    <div class="times">
                      <span>${K(e.pos)}</span>
                      <span>-${K(e.left)}</span>
                    </div>
                  </div>
                ` : p}
          </div>
        </div>
      </div>
    `;
  }
  _streamRow(t) {
    const e = this._progress(t);
    return c`
      <div class="streamrow ${t.state}" @click=${() => this._moreInfo(t.entityId)}>
        ${t.poster ? c`<img class="rowposter" src=${t.poster} alt="" loading="lazy" />` : c`<div class="rowposter poster-empty"><ha-icon .icon=${this._mediaIcon(t)}></ha-icon></div>`}
        <div class="row-info">
          <div class="row-top">
            <span class="stream-title">${t.title}</span>
            ${this._stateBadge(t)}
          </div>
          ${t.subline ? c`<div class="stream-sub">${t.subline}</div>` : p}
          <div class="row-bottom">
            ${this._avatar(t.user)}
            <span class="username">${t.user ?? t.device ?? ""}</span>
            ${e ? c`<span class="row-time">${K(e.pos)} / ${K(t.duration)}</span>` : p}
          </div>
          ${e ? c`<div class="bar slim"><div class="fill" style="width:${e.pct}%"></div></div>` : p}
        </div>
      </div>
    `;
  }
  /* ---- stats / custom ----------------------------------------------------- */
  _renderStats(t) {
    const e = (t.stats ?? t.entities ?? []).map((i) => this._stat(i));
    return c`
      <div class="section">
        ${this._sectionHead(t, t.type === "custom" ? "mdi:gauge" : "mdi:bookshelf")}
        <div class="stat-grid" style="--pg-cols:${t.columns ?? Math.min(3, Math.max(2, e.length))}">
          ${e.map((i) => {
      const s = !this.hass.states[i.entity];
      return c`
              <div class="stat" @click=${() => this._moreInfo(i.entity)}>
                <span class="iconchip" style=${i.color ? `--pg-accent:${i.color};--pg-accent2:${i.color}` : ""}>
                  <ha-icon .icon=${i.icon ?? "mdi:counter"}></ha-icon>
                </span>
                <div class="stat-body">
                  <div class="stat-value">${s ? "–" : this._statValue(i)}</div>
                  <div class="stat-label">${s ? m(this.hass, "entity_missing") : this._statName(i)}</div>
                </div>
              </div>
            `;
    })}
        </div>
      </div>
    `;
  }
  /* ---- recently added ------------------------------------------------------ */
  _renderRecent(t, e) {
    let i = [], s = !1;
    if (t.url && t.token) {
      const r = this._recentCache[e];
      i = (r == null ? void 0 : r.data) ?? [], s = !!(r != null && r.error) && !(r != null && r.data);
    } else
      i = vt(t.entity ? this.hass.states[t.entity] : void 0);
    return i = i.slice(0, t.limit ?? 10), c`
      <div class="section">
        ${this._sectionHead(t, "mdi:new-box")}
        ${s ? c`<div class="err">${m(this.hass, "fetch_error")}</div>` : i.length ? c`
                <div class="shelf">
                  ${i.map((r) => {
      const n = r.added != null && Date.now() - r.added < 1728e5;
      return c`
                      <div class="shelf-item" title=${r.title}>
                        <div class="shelf-poster">
                          ${r.poster ? c`<img src=${r.poster} alt="" loading="lazy" />` : c`<ha-icon icon="mdi:movie-open-outline"></ha-icon>`}
                          ${n ? c`<span class="newbadge">${m(this.hass, "new")}</span>` : p}
                        </div>
                        <div class="shelf-title">${r.title}</div>
                        <div class="shelf-sub">
                          ${r.subline ?? ""}${r.added ? c` <span class="shelf-ago">${ft(r.added, this.hass)}</span>` : p}
                        </div>
                      </div>
                    `;
    })}
                </div>
              ` : c`<div class="err soft">${m(this.hass, "no_items")}</div>`}
      </div>
    `;
  }
  /* ---- activity ------------------------------------------------------------ */
  _renderActivity(t, e) {
    const i = this._activityEntity(t), s = this._activityHours(t, e), r = this._activityRanges(t), n = i ? this._historyCache[`${i}|${s}`] : void 0, a = n == null ? void 0 : n.data, l = this._num(i), o = a != null && a.length ? Math.max(...a, Number.isFinite(l) ? l : 0) : NaN, d = c`<span class="sec-chips">
      ${Number.isFinite(l) ? c`<span class="chip accented">${m(this.hass, "now")}: ${f(l, this.hass)}</span>` : p}
      ${Number.isFinite(o) ? c`<span class="chip">${m(this.hass, "peak")}: ${f(o, this.hass)}</span>` : p}
    </span>`;
    return c`
      <div class="section">
        ${this._sectionHead(t, "mdi:chart-areaspline", d)}
        ${r.length > 1 ? c`<div class="rangetabs">
              ${r.map(
      (h) => c`<button
                  class="rangetab ${h === s ? "active" : ""}"
                  @click=${() => this._selectRange(e, h)}
                >
                  ${ht(this.hass, h)}
                </button>`
    )}
            </div>` : p}
        ${i ? a ? c`<div class="chart">
                ${Ke(a, {
      id: `pg-area-${e}`,
      accent: t.color ?? "var(--pg-accent)",
      grid: !0
    })}
                <div class="chart-x">
                  <span>${ut(this.hass, s)}</span>
                  <span>${m(this.hass, "now")}</span>
                </div>
              </div>` : n != null && n.error ? c`<div class="err soft">${m(this.hass, "no_data")}</div>` : c`<div class="chart loading"></div>` : c`<div class="err soft">${m(this.hass, "entity_missing")}</div>`}
      </div>
    `;
  }
  _selectRange(t, e) {
    this._range = { ...this._range, [t]: e };
  }
  /* ---- top ------------------------------------------------------------------ */
  _renderTop(t) {
    const e = (t.entities ?? t.stats ?? []).map((i) => this._stat(i));
    return c`
      <div class="section">
        ${this._sectionHead(t, "mdi:trophy-outline")}
        <div class="toplist">
          ${e.map((i, s) => {
      const r = this.hass.states[i.entity];
      return c`
              <div class="toprow" @click=${() => this._moreInfo(i.entity)}>
                <span class="rank r${s + 1}">${s + 1}</span>
                <span class="iconchip small"><ha-icon .icon=${i.icon ?? "mdi:star"}></ha-icon></span>
                <div class="top-body">
                  <div class="top-value">${r ? this._statValue(i) : "–"}</div>
                  <div class="stat-label">${this._statName(i)}</div>
                </div>
              </div>
            `;
    })}
        </div>
      </div>
    `;
  }
  /* ---- requests -------------------------------------------------------------- */
  _renderRequests(t, e) {
    if (t.url && t.token) {
      const i = this._seerrCache[e], s = i == null ? void 0 : i.data, r = [
        { key: "pending", icon: "mdi:clock-outline", cls: "warn" },
        { key: "approved", icon: "mdi:check-circle-outline", cls: "good" },
        { key: "processing", icon: "mdi:progress-download" },
        { key: "available", icon: "mdi:play-circle-outline", cls: "good" }
      ];
      return c`
        <div class="section">
          ${this._sectionHead(t, "mdi:message-plus-outline")}
          ${s ? c`<div class="stat-grid" style="--pg-cols:${t.columns ?? 4}">
                ${r.filter((n) => s[n.key] != null).map(
        (n) => c`
                      <div class="stat">
                        <span class="iconchip ${n.cls ?? ""}"><ha-icon .icon=${n.icon}></ha-icon></span>
                        <div class="stat-body">
                          <div class="stat-value">${f(s[n.key], this.hass)}</div>
                          <div class="stat-label">${m(this.hass, n.key)}</div>
                        </div>
                      </div>
                    `
      )}
              </div>` : c`<div class="err ${i != null && i.error ? "" : "soft"}">
                ${i != null && i.error ? m(this.hass, "fetch_error") : m(this.hass, "no_data")}
              </div>`}
        </div>
      `;
    }
    return this._renderStats({ ...t, stats: t.entities ?? t.stats ?? [] });
  }
};
y.styles = de`
    :host {
      --pg-accent: #e5a00d;
      --pg-accent2: #f7c247;
      --pg-card-bg: var(--ha-card-background, var(--card-background-color, #fff));
      --pg-tile-bg: color-mix(in srgb, var(--primary-text-color) 5%, transparent);
      --pg-tile-radius: 16px;
      --pg-text: var(--primary-text-color);
      --pg-text2: var(--secondary-text-color);
    }
    ha-card.cardroot,
    .cardroot.nobg {
      padding: 16px;
      overflow: hidden;
      position: relative;
    }
    .cardroot.flush {
      padding: 0;
    }

    /* ---- header ---- */
    .header {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 2px 2px 14px;
    }
    .brandmark {
      width: 38px;
      height: 38px;
      border-radius: 12px;
      flex: none;
      display: grid;
      place-items: center;
      background: linear-gradient(135deg, var(--pg-accent), var(--pg-accent2));
      box-shadow: 0 4px 14px color-mix(in srgb, var(--pg-accent) 40%, transparent);
    }
    .brandmark svg {
      width: 22px;
      height: 22px;
      fill: #fff;
      filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.25));
    }
    .header-text {
      flex: 1;
      min-width: 0;
    }
    .title {
      font-size: 1.15rem;
      font-weight: 700;
      color: var(--pg-text);
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .subtitle {
      font-size: 0.82rem;
      color: var(--pg-text2);
    }
    .statusdot {
      width: 9px;
      height: 9px;
      border-radius: 50%;
      flex: none;
    }
    .statusdot.on {
      background: var(--success-color, #2e7d32);
      box-shadow: 0 0 0 3px color-mix(in srgb, var(--success-color, #2e7d32) 25%, transparent);
      animation: pg-pulse 2.4s ease-in-out infinite;
    }
    .statusdot.off {
      background: var(--error-color, #c62828);
    }
    @keyframes pg-pulse {
      0%, 100% { box-shadow: 0 0 0 3px color-mix(in srgb, var(--success-color, #2e7d32) 25%, transparent); }
      50% { box-shadow: 0 0 0 6px color-mix(in srgb, var(--success-color, #2e7d32) 10%, transparent); }
    }
    .header-chips {
      display: flex;
      gap: 6px;
      flex: none;
    }

    /* ---- chips ---- */
    .chip {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 3px 9px;
      border-radius: 999px;
      font-size: 0.74rem;
      font-weight: 600;
      color: var(--pg-text2);
      background: var(--pg-tile-bg);
      white-space: nowrap;
    }
    .chip ha-icon {
      --mdc-icon-size: 14px;
    }
    .chip.accented {
      background: color-mix(in srgb, var(--pg-accent) 18%, transparent);
      color: color-mix(in srgb, var(--pg-accent) 70%, var(--pg-text));
    }
    .chip.good {
      background: color-mix(in srgb, var(--success-color, #2e7d32) 14%, transparent);
      color: var(--success-color, #2e7d32);
    }
    .chip.warn {
      background: color-mix(in srgb, var(--warning-color, #fb8c00) 16%, transparent);
      color: var(--warning-color, #fb8c00);
    }

    /* ---- sections ---- */
    .sections {
      display: flex;
      flex-direction: column;
      gap: 18px;
    }
    .sec-head {
      display: flex;
      align-items: center;
      gap: 7px;
      margin-bottom: 10px;
      color: var(--pg-text2);
    }
    .sec-head > ha-icon {
      --mdc-icon-size: 17px;
      color: var(--pg-accent);
    }
    .sec-title {
      font-size: 0.8rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      flex: 1;
    }
    .sec-chips {
      display: flex;
      gap: 6px;
      flex-wrap: wrap;
    }

    /* ---- now playing ---- */
    .streams {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .stream {
      position: relative;
      border-radius: var(--pg-tile-radius);
      overflow: hidden;
      background: #101015;
      cursor: pointer;
      color: #fff;
    }
    .backdrop {
      position: absolute;
      inset: -20px;
      background-size: cover;
      background-position: center 20%;
      filter: blur(22px) saturate(1.3) brightness(0.55);
      transform: scale(1.15);
    }
    .stream-inner {
      position: relative;
      display: flex;
      gap: 14px;
      padding: 14px;
      background: linear-gradient(100deg, rgba(10, 10, 16, 0.55), rgba(10, 10, 16, 0.18));
    }
    .poster {
      width: 74px;
      aspect-ratio: 2 / 3;
      object-fit: cover;
      border-radius: 10px;
      flex: none;
      box-shadow: 0 6px 18px rgba(0, 0, 0, 0.5);
    }
    .poster-empty {
      display: grid;
      place-items: center;
      background: rgba(255, 255, 255, 0.08);
      color: rgba(255, 255, 255, 0.6);
    }
    .stream-info {
      flex: 1;
      min-width: 0;
      display: flex;
      flex-direction: column;
      gap: 4px;
      justify-content: center;
    }
    .stream-title {
      font-weight: 700;
      font-size: 1rem;
      line-height: 1.25;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
    }
    .stream-sub {
      font-size: 0.8rem;
      opacity: 0.85;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .stream-meta {
      display: flex;
      align-items: center;
      gap: 7px;
      flex-wrap: wrap;
      margin-top: 2px;
      font-size: 0.76rem;
    }
    .stream .chip,
    .stream .device {
      background: rgba(255, 255, 255, 0.14);
      color: rgba(255, 255, 255, 0.92);
    }
    .device {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 3px 9px;
      border-radius: 999px;
      font-size: 0.74rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 220px;
    }
    .device ha-icon {
      --mdc-icon-size: 13px;
    }
    .avatar {
      width: 22px;
      height: 22px;
      border-radius: 50%;
      flex: none;
      display: grid;
      place-items: center;
      font-size: 0.72rem;
      font-weight: 800;
      color: #fff;
      background: linear-gradient(135deg, var(--pg-accent), var(--pg-accent2));
    }
    .username {
      font-weight: 600;
      opacity: 0.95;
    }
    .progress {
      margin-top: 6px;
    }
    .bar {
      height: 5px;
      border-radius: 999px;
      background: rgba(255, 255, 255, 0.18);
      overflow: hidden;
    }
    .bar.slim {
      height: 3px;
      margin-top: 6px;
      background: color-mix(in srgb, var(--pg-text) 14%, transparent);
    }
    .fill {
      height: 100%;
      border-radius: 999px;
      background: linear-gradient(90deg, var(--pg-accent), var(--pg-accent2));
      transition: width 0.9s linear;
    }
    .paused .fill {
      background: rgba(255, 255, 255, 0.55);
    }
    .times {
      display: flex;
      justify-content: space-between;
      font-size: 0.7rem;
      opacity: 0.8;
      margin-top: 3px;
      font-variant-numeric: tabular-nums;
    }

    /* compact rows */
    .streamrow {
      display: flex;
      gap: 12px;
      padding: 10px;
      border-radius: var(--pg-tile-radius);
      background: var(--pg-tile-bg);
      cursor: pointer;
      color: var(--pg-text);
    }
    .rowposter {
      width: 46px;
      aspect-ratio: 2 / 3;
      object-fit: cover;
      border-radius: 7px;
      flex: none;
    }
    .row-info {
      flex: 1;
      min-width: 0;
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 2px;
    }
    .row-top {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .streamrow .stream-title {
      font-size: 0.9rem;
      -webkit-line-clamp: 1;
      text-shadow: none;
      flex: 1;
    }
    .streamrow .stream-sub {
      color: var(--pg-text2);
      opacity: 1;
    }
    .row-bottom {
      display: flex;
      align-items: center;
      gap: 7px;
      font-size: 0.76rem;
      color: var(--pg-text2);
    }
    .row-time {
      margin-left: auto;
      font-variant-numeric: tabular-nums;
      font-size: 0.72rem;
    }
    .streamrow .chip {
      background: color-mix(in srgb, var(--pg-text) 8%, transparent);
      color: var(--pg-text2);
    }

    /* idle */
    .idle {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 18px 16px;
      border-radius: var(--pg-tile-radius);
      background: var(--pg-tile-bg);
      color: var(--pg-text2);
    }
    .idle ha-icon {
      --mdc-icon-size: 30px;
      opacity: 0.55;
    }
    .idle-title {
      font-weight: 700;
      color: var(--pg-text);
    }
    .idle-hint {
      font-size: 0.78rem;
    }

    /* ---- stats ---- */
    .stat-grid {
      display: grid;
      grid-template-columns: repeat(var(--pg-cols, 3), 1fr);
      gap: 10px;
    }
    .stat {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 12px;
      border-radius: var(--pg-tile-radius);
      background: var(--pg-tile-bg);
      cursor: pointer;
      min-width: 0;
    }
    .iconchip {
      width: 36px;
      height: 36px;
      border-radius: 11px;
      flex: none;
      display: grid;
      place-items: center;
      color: var(--pg-accent);
      background: color-mix(in srgb, var(--pg-accent) 16%, transparent);
    }
    .iconchip ha-icon {
      --mdc-icon-size: 19px;
    }
    .iconchip.small {
      width: 30px;
      height: 30px;
      border-radius: 9px;
    }
    .iconchip.good {
      color: var(--success-color, #2e7d32);
      background: color-mix(in srgb, var(--success-color, #2e7d32) 14%, transparent);
    }
    .iconchip.warn {
      color: var(--warning-color, #fb8c00);
      background: color-mix(in srgb, var(--warning-color, #fb8c00) 16%, transparent);
    }
    .stat-body {
      min-width: 0;
    }
    .stat-value {
      font-size: 1.05rem;
      font-weight: 800;
      color: var(--pg-text);
      line-height: 1.2;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .stat-label {
      font-size: 0.72rem;
      color: var(--pg-text2);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    /* ---- shelf (recently added) ---- */
    .shelf {
      display: flex;
      gap: 12px;
      overflow-x: auto;
      padding-bottom: 6px;
      scrollbar-width: thin;
      scroll-snap-type: x proximity;
    }
    .shelf-item {
      width: 96px;
      flex: none;
      scroll-snap-align: start;
    }
    .shelf-poster {
      position: relative;
      width: 96px;
      aspect-ratio: 2 / 3;
      border-radius: 10px;
      overflow: hidden;
      background: var(--pg-tile-bg);
      display: grid;
      place-items: center;
      color: var(--pg-text2);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.18);
      transition: transform 0.18s ease;
    }
    .shelf-item:hover .shelf-poster {
      transform: translateY(-3px) scale(1.03);
    }
    .shelf-poster img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }
    .newbadge {
      position: absolute;
      top: 6px;
      left: 6px;
      padding: 2px 6px;
      border-radius: 6px;
      font-size: 0.6rem;
      font-weight: 800;
      letter-spacing: 0.05em;
      color: #fff;
      background: linear-gradient(135deg, var(--pg-accent), var(--pg-accent2));
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.35);
    }
    .shelf-title {
      margin-top: 6px;
      font-size: 0.76rem;
      font-weight: 700;
      color: var(--pg-text);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .shelf-sub {
      font-size: 0.68rem;
      color: var(--pg-text2);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .shelf-ago {
      opacity: 0.8;
    }

    /* ---- chart ---- */
    .chart {
      border-radius: var(--pg-tile-radius);
      background: var(--pg-tile-bg);
      padding: 10px 10px 8px;
    }
    .chart svg {
      display: block;
      width: 100%;
      height: 110px;
    }
    .chart .grid {
      stroke: color-mix(in srgb, var(--pg-text) 12%, transparent);
      stroke-dasharray: 3 4;
      vector-effect: non-scaling-stroke;
    }
    .chart .gridlabel {
      font-size: 9px;
      fill: var(--pg-text2);
    }
    .chart-x {
      display: flex;
      justify-content: space-between;
      font-size: 0.68rem;
      color: var(--pg-text2);
      margin-top: 4px;
    }
    .chart.loading {
      height: 130px;
      border-radius: var(--pg-tile-radius);
      background: linear-gradient(
        100deg,
        var(--pg-tile-bg) 30%,
        color-mix(in srgb, var(--pg-text) 8%, var(--pg-tile-bg)) 50%,
        var(--pg-tile-bg) 70%
      );
      background-size: 200% 100%;
      animation: pg-shimmer 1.4s ease-in-out infinite;
    }
    @keyframes pg-shimmer {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }

    /* ---- range toggle ---- */
    .rangetabs {
      display: flex;
      gap: 4px;
      margin-bottom: 10px;
      padding: 3px;
      border-radius: 999px;
      background: var(--pg-tile-bg);
      width: fit-content;
    }
    .rangetab {
      border: none;
      background: none;
      cursor: pointer;
      font: inherit;
      font-size: 0.74rem;
      font-weight: 600;
      color: var(--pg-text2);
      padding: 4px 12px;
      border-radius: 999px;
      transition: background 0.15s ease, color 0.15s ease;
    }
    .rangetab:hover {
      color: var(--pg-text);
    }
    .rangetab.active {
      color: #fff;
      background: linear-gradient(135deg, var(--pg-accent), var(--pg-accent2));
      box-shadow: 0 2px 8px color-mix(in srgb, var(--pg-accent) 35%, transparent);
    }

    /* ---- top ---- */
    .toplist {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .toprow {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 12px;
      border-radius: var(--pg-tile-radius);
      background: var(--pg-tile-bg);
      cursor: pointer;
    }
    .rank {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      flex: none;
      display: grid;
      place-items: center;
      font-size: 0.76rem;
      font-weight: 800;
      color: var(--pg-text2);
      background: color-mix(in srgb, var(--pg-text) 8%, transparent);
    }
    .rank.r1 {
      color: #7a5c00;
      background: linear-gradient(135deg, #ffd76a, #e5a00d);
    }
    .rank.r2 {
      color: #494f57;
      background: linear-gradient(135deg, #e8edf2, #b7c0ca);
    }
    .rank.r3 {
      color: #5b3a1e;
      background: linear-gradient(135deg, #e3a878, #b97333);
    }
    .top-body {
      min-width: 0;
      flex: 1;
    }
    .top-value {
      font-weight: 700;
      color: var(--pg-text);
      font-size: 0.92rem;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    /* ---- misc ---- */
    .err {
      padding: 12px 14px;
      border-radius: var(--pg-tile-radius);
      background: color-mix(in srgb, var(--error-color, #c62828) 10%, transparent);
      color: var(--error-color, #c62828);
      font-size: 0.8rem;
    }
    .err.soft {
      background: var(--pg-tile-bg);
      color: var(--pg-text2);
    }

    /* ---- card styles ---- */
    .s-glass {
      --pg-tile-bg: color-mix(in srgb, var(--pg-card-bg) 42%, transparent);
      --pg-tile-radius: 20px;
    }
    ha-card.cardroot.s-glass {
      background: color-mix(in srgb, var(--pg-card-bg) 55%, transparent);
      -webkit-backdrop-filter: blur(18px) saturate(1.5);
      backdrop-filter: blur(18px) saturate(1.5);
    }
    .s-glass .stat,
    .s-glass .streamrow,
    .s-glass .idle,
    .s-glass .toprow,
    .s-glass .chart {
      border: 1px solid color-mix(in srgb, var(--primary-text-color) 12%, transparent);
      box-shadow:
        inset 0 1px 0 color-mix(in srgb, #fff 25%, transparent),
        0 8px 24px color-mix(in srgb, #000 10%, transparent);
      -webkit-backdrop-filter: blur(18px) saturate(1.5);
      backdrop-filter: blur(18px) saturate(1.5);
    }
    .s-glass .stream {
      border: 1px solid rgba(255, 255, 255, 0.14);
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.18),
        0 10px 28px rgba(0, 0, 0, 0.3);
    }
    .s-glass .iconchip {
      border: 1px solid color-mix(in srgb, #fff 30%, transparent);
      box-shadow: inset 0 1px 0 color-mix(in srgb, #fff 40%, transparent);
    }

    .s-material {
      --pg-tile-radius: 22px;
      --pg-tile-bg: color-mix(in srgb, var(--pg-accent) 10%, var(--pg-card-bg));
    }
    ha-card.cardroot.s-material {
      border-radius: 28px;
    }
    .s-material .iconchip {
      border-radius: 13px;
      background: var(--pg-accent);
      color: var(--pg-card-bg);
    }
    .s-material .brandmark {
      border-radius: 14px;
    }

    .s-bubble {
      --pg-tile-bg: var(--pg-card-bg);
      --pg-tile-radius: 26px;
    }
    ha-card.cardroot.s-bubble {
      background: none;
      box-shadow: none;
      border: none;
    }
    .s-bubble .stat,
    .s-bubble .streamrow,
    .s-bubble .idle,
    .s-bubble .toprow,
    .s-bubble .chart {
      box-shadow: var(--ha-card-box-shadow, 0 2px 8px rgba(0, 0, 0, 0.08));
    }
    .s-bubble .stream {
      box-shadow: var(--ha-card-box-shadow, 0 2px 8px rgba(0, 0, 0, 0.18));
    }

    .s-mirror {
      --pg-tile-bg: #000;
      --pg-tile-radius: 12px;
      --pg-text: #fff;
      --pg-text2: #bbb;
      color: #fff;
    }
    ha-card.cardroot.s-mirror {
      background: #000;
      box-shadow: none;
      border: none;
    }
    .s-mirror .stat,
    .s-mirror .streamrow,
    .s-mirror .idle,
    .s-mirror .toprow,
    .s-mirror .chart,
    .s-mirror .shelf-poster {
      border: 1px solid rgba(255, 255, 255, 0.28);
      background: #000;
    }
    .s-mirror .stream {
      border: 1px solid rgba(255, 255, 255, 0.28);
    }
    .s-mirror .brandmark {
      background: #000;
      border: 1px solid rgba(255, 255, 255, 0.4);
      box-shadow: none;
    }
    .s-mirror .brandmark svg {
      fill: #fff;
    }
    .s-mirror .title,
    .s-mirror .stat-value,
    .s-mirror .top-value {
      color: #fff;
    }
    .s-mirror .subtitle,
    .s-mirror .stat-label,
    .s-mirror .sec-head,
    .s-mirror .chart-x {
      color: #bbb;
    }
    .s-mirror .sec-head > ha-icon,
    .s-mirror .iconchip {
      color: #fff;
      background: #000;
    }
    .s-mirror .chip,
    .s-mirror .chip.accented {
      background: #000;
      border: 1px solid rgba(255, 255, 255, 0.35);
      color: #ddd;
    }
    .s-mirror .fill {
      background: #fff;
    }
    .s-mirror .rangetabs {
      background: #000;
      border: 1px solid rgba(255, 255, 255, 0.28);
    }
    .s-mirror .rangetab.active {
      background: #fff;
      color: #000;
      box-shadow: none;
    }
    .s-mirror .avatar,
    .s-mirror .newbadge {
      background: #fff;
      color: #000;
    }
    .s-mirror .rank.r1,
    .s-mirror .rank.r2,
    .s-mirror .rank.r3 {
      background: #fff;
      color: #000;
    }

    /* ---- collapsed (minimal) mode ---- */
    ha-card.cardroot.collapsed,
    .cardroot.collapsed.nobg {
      padding: 0;
    }
    .peek {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 14px;
      cursor: pointer;
    }
    .peek .brandmark {
      width: 36px;
      height: 36px;
      border-radius: 11px;
    }
    .peek .brandmark.idle {
      background: var(--pg-tile-bg);
      box-shadow: none;
    }
    .peek .brandmark.idle svg {
      fill: var(--pg-text2);
      filter: none;
    }
    .peek-body {
      flex: 1;
      min-width: 0;
    }
    .peek-top {
      display: flex;
      align-items: center;
      gap: 7px;
    }
    .peek-title {
      font-size: 1rem;
      font-weight: 700;
      color: var(--pg-text);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .peek-count {
      margin-left: auto;
      font-size: 0.72rem;
      font-weight: 700;
      color: color-mix(in srgb, var(--pg-accent) 72%, var(--pg-text));
      background: color-mix(in srgb, var(--pg-accent) 16%, transparent);
      padding: 2px 9px;
      border-radius: 999px;
      white-space: nowrap;
    }
    .peek-streams {
      display: flex;
      flex-direction: column;
      gap: 2px;
      margin-top: 3px;
    }
    .peek-row {
      display: flex;
      align-items: center;
      gap: 6px;
      min-width: 0;
    }
    .peek-state {
      --mdc-icon-size: 13px;
      color: var(--pg-accent);
      flex: none;
    }
    .peek-name {
      font-size: 0.82rem;
      font-weight: 600;
      color: var(--pg-text);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .peek-user {
      font-size: 0.76rem;
      color: var(--pg-text2);
      white-space: nowrap;
      flex: none;
    }
    .peek-user::before {
      content: '· ';
    }
    .peek-idle {
      font-size: 0.8rem;
      color: var(--pg-text2);
      margin-top: 2px;
    }
    .peek-expand {
      --mdc-icon-size: 22px;
      color: var(--pg-text2);
      flex: none;
    }

    /* ---- detail popup ---- */
    .pg-overlay {
      position: fixed;
      inset: 0;
      z-index: 9;
      display: flex;
      align-items: flex-end;
      justify-content: center;
      padding: 0;
      background: rgba(0, 0, 0, 0.5);
      -webkit-backdrop-filter: blur(3px);
      backdrop-filter: blur(3px);
      animation: pg-fade 0.18s ease;
    }
    @keyframes pg-fade {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    .dialog {
      position: relative;
      width: 100%;
      max-width: 500px;
      max-height: 88vh;
      display: flex;
      flex-direction: column;
      background: var(--pg-card-bg);
      color: var(--pg-text);
      border-radius: 22px 22px 0 0;
      box-shadow: 0 -8px 40px rgba(0, 0, 0, 0.35);
      overflow: hidden;
      animation: pg-slideup 0.24s cubic-bezier(0.2, 0.7, 0.2, 1);
    }
    @keyframes pg-slideup {
      from { transform: translateY(24px); opacity: 0.6; }
      to { transform: translateY(0); opacity: 1; }
    }
    .dialog-head {
      position: relative;
      padding: 16px 16px 0;
      flex: none;
    }
    .dialog-head .header {
      padding-bottom: 8px;
      padding-right: 40px;
    }
    .dialog-close {
      position: absolute;
      top: 14px;
      right: 12px;
      border: none;
      background: var(--pg-tile-bg);
      color: var(--pg-text2);
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: grid;
      place-items: center;
      cursor: pointer;
    }
    .dialog-close:hover {
      color: var(--pg-text);
    }
    .dialog-close ha-icon {
      --mdc-icon-size: 20px;
    }
    .dialog-body {
      padding: 8px 16px 20px;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
    }
    .s-mirror.pg-overlay .dialog {
      background: #000;
      color: #fff;
      border: 1px solid rgba(255, 255, 255, 0.28);
    }
    @media (min-width: 540px) {
      .pg-overlay {
        align-items: center;
      }
      .dialog {
        border-radius: 22px;
      }
    }

    @media (max-width: 460px) {
      .stat-grid {
        grid-template-columns: repeat(2, 1fr);
      }
      .header-chips .chip:not(.accented) {
        display: none;
      }
    }
  `;
k([
  q({ attribute: !1 })
], y.prototype, "hass", 2);
k([
  _()
], y.prototype, "_config", 2);
k([
  _()
], y.prototype, "_historyCache", 2);
k([
  _()
], y.prototype, "_recentCache", 2);
k([
  _()
], y.prototype, "_seerrCache", 2);
k([
  _()
], y.prototype, "_range", 2);
k([
  _()
], y.prototype, "_popup", 2);
y = k([
  Z("plexglass-card")
], y);
window.customCards = window.customCards ?? [];
window.customCards.push({
  type: "plexglass-card",
  name: "Plexglass",
  description: "Cinematic media-server dashboard: active streams (Plex/Jellyfin/Emby), library stats, recently added, activity graph and requests.",
  preview: !0
});
console.info(
  `%c PLEXGLASS %c v${jt} `,
  "background:#e5a00d;color:#1f1f1f;font-weight:700;border-radius:4px 0 0 4px;padding:2px 6px;",
  "background:#282a2d;color:#e5a00d;border-radius:0 4px 4px 0;padding:2px 6px;"
);
export {
  y as PlexglassCard
};
