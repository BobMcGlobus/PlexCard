/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const W = globalThis, ct = W.ShadowRoot && (W.ShadyCSS === void 0 || W.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, lt = Symbol(), mt = /* @__PURE__ */ new WeakMap();
let Mt = class {
  constructor(t, i, r) {
    if (this._$cssResult$ = !0, r !== lt) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = i;
  }
  get styleSheet() {
    let t = this.o;
    const i = this.t;
    if (ct && t === void 0) {
      const r = i !== void 0 && i.length === 1;
      r && (t = mt.get(i)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), r && mt.set(i, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const Ft = (e) => new Mt(typeof e == "string" ? e : e + "", void 0, lt), dt = (e, ...t) => {
  const i = e.length === 1 ? e[0] : t.reduce((r, s, n) => r + ((a) => {
    if (a._$cssResult$ === !0) return a.cssText;
    if (typeof a == "number") return a;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + a + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(s) + e[n + 1], e[0]);
  return new Mt(i, e, lt);
}, qt = (e, t) => {
  if (ct) e.adoptedStyleSheets = t.map((i) => i instanceof CSSStyleSheet ? i : i.styleSheet);
  else for (const i of t) {
    const r = document.createElement("style"), s = W.litNonce;
    s !== void 0 && r.setAttribute("nonce", s), r.textContent = i.cssText, e.appendChild(r);
  }
}, gt = ct ? (e) => e : (e) => e instanceof CSSStyleSheet ? ((t) => {
  let i = "";
  for (const r of t.cssRules) i += r.cssText;
  return Ft(i);
})(e) : e;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: Wt, defineProperty: Vt, getOwnPropertyDescriptor: Kt, getOwnPropertyNames: Jt, getOwnPropertySymbols: Gt, getPrototypeOf: Yt } = Object, x = globalThis, ft = x.trustedTypes, Zt = ft ? ft.emptyScript : "", tt = x.reactiveElementPolyfillSupport, D = (e, t) => e, K = { toAttribute(e, t) {
  switch (t) {
    case Boolean:
      e = e ? Zt : null;
      break;
    case Object:
    case Array:
      e = e == null ? e : JSON.stringify(e);
  }
  return e;
}, fromAttribute(e, t) {
  let i = e;
  switch (t) {
    case Boolean:
      i = e !== null;
      break;
    case Number:
      i = e === null ? null : Number(e);
      break;
    case Object:
    case Array:
      try {
        i = JSON.parse(e);
      } catch {
        i = null;
      }
  }
  return i;
} }, pt = (e, t) => !Wt(e, t), bt = { attribute: !0, type: String, converter: K, reflect: !1, useDefault: !1, hasChanged: pt };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), x.litPropertyMetadata ?? (x.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let T = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ?? (this.l = [])).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, i = bt) {
    if (i.state && (i.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((i = Object.create(i)).wrapped = !0), this.elementProperties.set(t, i), !i.noAccessor) {
      const r = Symbol(), s = this.getPropertyDescriptor(t, r, i);
      s !== void 0 && Vt(this.prototype, t, s);
    }
  }
  static getPropertyDescriptor(t, i, r) {
    const { get: s, set: n } = Kt(this.prototype, t) ?? { get() {
      return this[i];
    }, set(a) {
      this[i] = a;
    } };
    return { get: s, set(a) {
      const l = s == null ? void 0 : s.call(this);
      n == null || n.call(this, a), this.requestUpdate(t, l, r);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? bt;
  }
  static _$Ei() {
    if (this.hasOwnProperty(D("elementProperties"))) return;
    const t = Yt(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(D("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(D("properties"))) {
      const i = this.properties, r = [...Jt(i), ...Gt(i)];
      for (const s of r) this.createProperty(s, i[s]);
    }
    const t = this[Symbol.metadata];
    if (t !== null) {
      const i = litPropertyMetadata.get(t);
      if (i !== void 0) for (const [r, s] of i) this.elementProperties.set(r, s);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [i, r] of this.elementProperties) {
      const s = this._$Eu(i, r);
      s !== void 0 && this._$Eh.set(s, i);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(t) {
    const i = [];
    if (Array.isArray(t)) {
      const r = new Set(t.flat(1 / 0).reverse());
      for (const s of r) i.unshift(gt(s));
    } else t !== void 0 && i.push(gt(t));
    return i;
  }
  static _$Eu(t, i) {
    const r = i.attribute;
    return r === !1 ? void 0 : typeof r == "string" ? r : typeof t == "string" ? t.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    var t;
    this._$ES = new Promise((i) => this.enableUpdating = i), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), (t = this.constructor.l) == null || t.forEach((i) => i(this));
  }
  addController(t) {
    var i;
    (this._$EO ?? (this._$EO = /* @__PURE__ */ new Set())).add(t), this.renderRoot !== void 0 && this.isConnected && ((i = t.hostConnected) == null || i.call(t));
  }
  removeController(t) {
    var i;
    (i = this._$EO) == null || i.delete(t);
  }
  _$E_() {
    const t = /* @__PURE__ */ new Map(), i = this.constructor.elementProperties;
    for (const r of i.keys()) this.hasOwnProperty(r) && (t.set(r, this[r]), delete this[r]);
    t.size > 0 && (this._$Ep = t);
  }
  createRenderRoot() {
    const t = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return qt(t, this.constructor.elementStyles), t;
  }
  connectedCallback() {
    var t;
    this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this.enableUpdating(!0), (t = this._$EO) == null || t.forEach((i) => {
      var r;
      return (r = i.hostConnected) == null ? void 0 : r.call(i);
    });
  }
  enableUpdating(t) {
  }
  disconnectedCallback() {
    var t;
    (t = this._$EO) == null || t.forEach((i) => {
      var r;
      return (r = i.hostDisconnected) == null ? void 0 : r.call(i);
    });
  }
  attributeChangedCallback(t, i, r) {
    this._$AK(t, r);
  }
  _$ET(t, i) {
    var n;
    const r = this.constructor.elementProperties.get(t), s = this.constructor._$Eu(t, r);
    if (s !== void 0 && r.reflect === !0) {
      const a = (((n = r.converter) == null ? void 0 : n.toAttribute) !== void 0 ? r.converter : K).toAttribute(i, r.type);
      this._$Em = t, a == null ? this.removeAttribute(s) : this.setAttribute(s, a), this._$Em = null;
    }
  }
  _$AK(t, i) {
    var n, a;
    const r = this.constructor, s = r._$Eh.get(t);
    if (s !== void 0 && this._$Em !== s) {
      const l = r.getPropertyOptions(s), o = typeof l.converter == "function" ? { fromAttribute: l.converter } : ((n = l.converter) == null ? void 0 : n.fromAttribute) !== void 0 ? l.converter : K;
      this._$Em = s;
      const d = o.fromAttribute(i, l.type);
      this[s] = d ?? ((a = this._$Ej) == null ? void 0 : a.get(s)) ?? d, this._$Em = null;
    }
  }
  requestUpdate(t, i, r, s = !1, n) {
    var a;
    if (t !== void 0) {
      const l = this.constructor;
      if (s === !1 && (n = this[t]), r ?? (r = l.getPropertyOptions(t)), !((r.hasChanged ?? pt)(n, i) || r.useDefault && r.reflect && n === ((a = this._$Ej) == null ? void 0 : a.get(t)) && !this.hasAttribute(l._$Eu(t, r)))) return;
      this.C(t, i, r);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, i, { useDefault: r, reflect: s, wrapped: n }, a) {
    r && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(t) && (this._$Ej.set(t, a ?? i ?? this[t]), n !== !0 || a !== void 0) || (this._$AL.has(t) || (this.hasUpdated || r || (i = void 0), this._$AL.set(t, i)), s === !0 && this._$Em !== t && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(t));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (i) {
      Promise.reject(i);
    }
    const t = this.scheduleUpdate();
    return t != null && await t, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    var r;
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this._$Ep) {
        for (const [n, a] of this._$Ep) this[n] = a;
        this._$Ep = void 0;
      }
      const s = this.constructor.elementProperties;
      if (s.size > 0) for (const [n, a] of s) {
        const { wrapped: l } = a, o = this[n];
        l !== !0 || this._$AL.has(n) || o === void 0 || this.C(n, void 0, a, o);
      }
    }
    let t = !1;
    const i = this._$AL;
    try {
      t = this.shouldUpdate(i), t ? (this.willUpdate(i), (r = this._$EO) == null || r.forEach((s) => {
        var n;
        return (n = s.hostUpdate) == null ? void 0 : n.call(s);
      }), this.update(i)) : this._$EM();
    } catch (s) {
      throw t = !1, this._$EM(), s;
    }
    t && this._$AE(i);
  }
  willUpdate(t) {
  }
  _$AE(t) {
    var i;
    (i = this._$EO) == null || i.forEach((r) => {
      var s;
      return (s = r.hostUpdated) == null ? void 0 : s.call(r);
    }), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(t)), this.updated(t);
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
  shouldUpdate(t) {
    return !0;
  }
  update(t) {
    this._$Eq && (this._$Eq = this._$Eq.forEach((i) => this._$ET(i, this[i]))), this._$EM();
  }
  updated(t) {
  }
  firstUpdated(t) {
  }
};
T.elementStyles = [], T.shadowRootOptions = { mode: "open" }, T[D("elementProperties")] = /* @__PURE__ */ new Map(), T[D("finalized")] = /* @__PURE__ */ new Map(), tt == null || tt({ ReactiveElement: T }), (x.reactiveElementVersions ?? (x.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const I = globalThis, _t = (e) => e, J = I.trustedTypes, yt = J ? J.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, Rt = "$lit$", v = `lit$${Math.random().toFixed(9).slice(2)}$`, zt = "?" + v, Xt = `<${zt}>`, C = document, L = () => C.createComment(""), U = (e) => e === null || typeof e != "object" && typeof e != "function", ht = Array.isArray, Qt = (e) => ht(e) || typeof (e == null ? void 0 : e[Symbol.iterator]) == "function", et = `[ 	
\f\r]`, O = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, vt = /-->/g, xt = />/g, S = RegExp(`>|${et}(?:([^\\s"'>=/]+)(${et}*=${et}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), $t = /'/g, wt = /"/g, Ot = /^(?:script|style|textarea|title)$/i, Dt = (e) => (t, ...i) => ({ _$litType$: e, strings: t, values: i }), c = Dt(1), st = Dt(2), M = Symbol.for("lit-noChange"), p = Symbol.for("lit-nothing"), kt = /* @__PURE__ */ new WeakMap(), A = C.createTreeWalker(C, 129);
function It(e, t) {
  if (!ht(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return yt !== void 0 ? yt.createHTML(t) : t;
}
const te = (e, t) => {
  const i = e.length - 1, r = [];
  let s, n = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", a = O;
  for (let l = 0; l < i; l++) {
    const o = e[l];
    let d, h, m = -1, u = 0;
    for (; u < o.length && (a.lastIndex = u, h = a.exec(o), h !== null); ) u = a.lastIndex, a === O ? h[1] === "!--" ? a = vt : h[1] !== void 0 ? a = xt : h[2] !== void 0 ? (Ot.test(h[2]) && (s = RegExp("</" + h[2], "g")), a = S) : h[3] !== void 0 && (a = S) : a === S ? h[0] === ">" ? (a = s ?? O, m = -1) : h[1] === void 0 ? m = -2 : (m = a.lastIndex - h[2].length, d = h[1], a = h[3] === void 0 ? S : h[3] === '"' ? wt : $t) : a === wt || a === $t ? a = S : a === vt || a === xt ? a = O : (a = S, s = void 0);
    const b = a === S && e[l + 1].startsWith("/>") ? " " : "";
    n += a === O ? o + Xt : m >= 0 ? (r.push(d), o.slice(0, m) + Rt + o.slice(m) + v + b) : o + v + (m === -2 ? l : b);
  }
  return [It(e, n + (e[i] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), r];
};
class H {
  constructor({ strings: t, _$litType$: i }, r) {
    let s;
    this.parts = [];
    let n = 0, a = 0;
    const l = t.length - 1, o = this.parts, [d, h] = te(t, i);
    if (this.el = H.createElement(d, r), A.currentNode = this.el.content, i === 2 || i === 3) {
      const m = this.el.content.firstChild;
      m.replaceWith(...m.childNodes);
    }
    for (; (s = A.nextNode()) !== null && o.length < l; ) {
      if (s.nodeType === 1) {
        if (s.hasAttributes()) for (const m of s.getAttributeNames()) if (m.endsWith(Rt)) {
          const u = h[a++], b = s.getAttribute(m).split(v), k = /([.?@])?(.*)/.exec(u);
          o.push({ type: 1, index: n, name: k[2], strings: b, ctor: k[1] === "." ? ie : k[1] === "?" ? re : k[1] === "@" ? se : Y }), s.removeAttribute(m);
        } else m.startsWith(v) && (o.push({ type: 6, index: n }), s.removeAttribute(m));
        if (Ot.test(s.tagName)) {
          const m = s.textContent.split(v), u = m.length - 1;
          if (u > 0) {
            s.textContent = J ? J.emptyScript : "";
            for (let b = 0; b < u; b++) s.append(m[b], L()), A.nextNode(), o.push({ type: 2, index: ++n });
            s.append(m[u], L());
          }
        }
      } else if (s.nodeType === 8) if (s.data === zt) o.push({ type: 2, index: n });
      else {
        let m = -1;
        for (; (m = s.data.indexOf(v, m + 1)) !== -1; ) o.push({ type: 7, index: n }), m += v.length - 1;
      }
      n++;
    }
  }
  static createElement(t, i) {
    const r = C.createElement("template");
    return r.innerHTML = t, r;
  }
}
function R(e, t, i = e, r) {
  var a, l;
  if (t === M) return t;
  let s = r !== void 0 ? (a = i._$Co) == null ? void 0 : a[r] : i._$Cl;
  const n = U(t) ? void 0 : t._$litDirective$;
  return (s == null ? void 0 : s.constructor) !== n && ((l = s == null ? void 0 : s._$AO) == null || l.call(s, !1), n === void 0 ? s = void 0 : (s = new n(e), s._$AT(e, i, r)), r !== void 0 ? (i._$Co ?? (i._$Co = []))[r] = s : i._$Cl = s), s !== void 0 && (t = R(e, s._$AS(e, t.values), s, r)), t;
}
class ee {
  constructor(t, i) {
    this._$AV = [], this._$AN = void 0, this._$AD = t, this._$AM = i;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(t) {
    const { el: { content: i }, parts: r } = this._$AD, s = ((t == null ? void 0 : t.creationScope) ?? C).importNode(i, !0);
    A.currentNode = s;
    let n = A.nextNode(), a = 0, l = 0, o = r[0];
    for (; o !== void 0; ) {
      if (a === o.index) {
        let d;
        o.type === 2 ? d = new j(n, n.nextSibling, this, t) : o.type === 1 ? d = new o.ctor(n, o.name, o.strings, this, t) : o.type === 6 && (d = new ne(n, this, t)), this._$AV.push(d), o = r[++l];
      }
      a !== (o == null ? void 0 : o.index) && (n = A.nextNode(), a++);
    }
    return A.currentNode = C, s;
  }
  p(t) {
    let i = 0;
    for (const r of this._$AV) r !== void 0 && (r.strings !== void 0 ? (r._$AI(t, r, i), i += r.strings.length - 2) : r._$AI(t[i])), i++;
  }
}
class j {
  get _$AU() {
    var t;
    return ((t = this._$AM) == null ? void 0 : t._$AU) ?? this._$Cv;
  }
  constructor(t, i, r, s) {
    this.type = 2, this._$AH = p, this._$AN = void 0, this._$AA = t, this._$AB = i, this._$AM = r, this.options = s, this._$Cv = (s == null ? void 0 : s.isConnected) ?? !0;
  }
  get parentNode() {
    let t = this._$AA.parentNode;
    const i = this._$AM;
    return i !== void 0 && (t == null ? void 0 : t.nodeType) === 11 && (t = i.parentNode), t;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t, i = this) {
    t = R(this, t, i), U(t) ? t === p || t == null || t === "" ? (this._$AH !== p && this._$AR(), this._$AH = p) : t !== this._$AH && t !== M && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : Qt(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== p && U(this._$AH) ? this._$AA.nextSibling.data = t : this.T(C.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    var n;
    const { values: i, _$litType$: r } = t, s = typeof r == "number" ? this._$AC(t) : (r.el === void 0 && (r.el = H.createElement(It(r.h, r.h[0]), this.options)), r);
    if (((n = this._$AH) == null ? void 0 : n._$AD) === s) this._$AH.p(i);
    else {
      const a = new ee(s, this), l = a.u(this.options);
      a.p(i), this.T(l), this._$AH = a;
    }
  }
  _$AC(t) {
    let i = kt.get(t.strings);
    return i === void 0 && kt.set(t.strings, i = new H(t)), i;
  }
  k(t) {
    ht(this._$AH) || (this._$AH = [], this._$AR());
    const i = this._$AH;
    let r, s = 0;
    for (const n of t) s === i.length ? i.push(r = new j(this.O(L()), this.O(L()), this, this.options)) : r = i[s], r._$AI(n), s++;
    s < i.length && (this._$AR(r && r._$AB.nextSibling, s), i.length = s);
  }
  _$AR(t = this._$AA.nextSibling, i) {
    var r;
    for ((r = this._$AP) == null ? void 0 : r.call(this, !1, !0, i); t !== this._$AB; ) {
      const s = _t(t).nextSibling;
      _t(t).remove(), t = s;
    }
  }
  setConnected(t) {
    var i;
    this._$AM === void 0 && (this._$Cv = t, (i = this._$AP) == null || i.call(this, t));
  }
}
class Y {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, i, r, s, n) {
    this.type = 1, this._$AH = p, this._$AN = void 0, this.element = t, this.name = i, this._$AM = s, this.options = n, r.length > 2 || r[0] !== "" || r[1] !== "" ? (this._$AH = Array(r.length - 1).fill(new String()), this.strings = r) : this._$AH = p;
  }
  _$AI(t, i = this, r, s) {
    const n = this.strings;
    let a = !1;
    if (n === void 0) t = R(this, t, i, 0), a = !U(t) || t !== this._$AH && t !== M, a && (this._$AH = t);
    else {
      const l = t;
      let o, d;
      for (t = n[0], o = 0; o < n.length - 1; o++) d = R(this, l[r + o], i, o), d === M && (d = this._$AH[o]), a || (a = !U(d) || d !== this._$AH[o]), d === p ? t = p : t !== p && (t += (d ?? "") + n[o + 1]), this._$AH[o] = d;
    }
    a && !s && this.j(t);
  }
  j(t) {
    t === p ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class ie extends Y {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === p ? void 0 : t;
  }
}
class re extends Y {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== p);
  }
}
class se extends Y {
  constructor(t, i, r, s, n) {
    super(t, i, r, s, n), this.type = 5;
  }
  _$AI(t, i = this) {
    if ((t = R(this, t, i, 0) ?? p) === M) return;
    const r = this._$AH, s = t === p && r !== p || t.capture !== r.capture || t.once !== r.once || t.passive !== r.passive, n = t !== p && (r === p || s);
    s && this.element.removeEventListener(this.name, this, r), n && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    var i;
    typeof this._$AH == "function" ? this._$AH.call(((i = this.options) == null ? void 0 : i.host) ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class ne {
  constructor(t, i, r) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = i, this.options = r;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    R(this, t);
  }
}
const it = I.litHtmlPolyfillSupport;
it == null || it(H, j), (I.litHtmlVersions ?? (I.litHtmlVersions = [])).push("3.3.3");
const ae = (e, t, i) => {
  const r = (i == null ? void 0 : i.renderBefore) ?? t;
  let s = r._$litPart$;
  if (s === void 0) {
    const n = (i == null ? void 0 : i.renderBefore) ?? null;
    r._$litPart$ = s = new j(t.insertBefore(L(), n), n, void 0, i ?? {});
  }
  return s._$AI(e), s;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const E = globalThis;
class $ extends T {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    var i;
    const t = super.createRenderRoot();
    return (i = this.renderOptions).renderBefore ?? (i.renderBefore = t.firstChild), t;
  }
  update(t) {
    const i = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = ae(i, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    var t;
    super.connectedCallback(), (t = this._$Do) == null || t.setConnected(!0);
  }
  disconnectedCallback() {
    var t;
    super.disconnectedCallback(), (t = this._$Do) == null || t.setConnected(!1);
  }
  render() {
    return M;
  }
}
var Tt;
$._$litElement$ = !0, $.finalized = !0, (Tt = E.litElementHydrateSupport) == null || Tt.call(E, { LitElement: $ });
const rt = E.litElementPolyfillSupport;
rt == null || rt({ LitElement: $ });
(E.litElementVersions ?? (E.litElementVersions = [])).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Z = (e) => (t, i) => {
  i !== void 0 ? i.addInitializer(() => {
    customElements.define(e, t);
  }) : customElements.define(e, t);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const oe = { attribute: !0, type: String, converter: K, reflect: !1, hasChanged: pt }, ce = (e = oe, t, i) => {
  const { kind: r, metadata: s } = i;
  let n = globalThis.litPropertyMetadata.get(s);
  if (n === void 0 && globalThis.litPropertyMetadata.set(s, n = /* @__PURE__ */ new Map()), r === "setter" && ((e = Object.create(e)).wrapped = !0), n.set(i.name, e), r === "accessor") {
    const { name: a } = i;
    return { set(l) {
      const o = t.get.call(this);
      t.set.call(this, l), this.requestUpdate(a, o, e, !0, l);
    }, init(l) {
      return l !== void 0 && this.C(a, void 0, e, l), l;
    } };
  }
  if (r === "setter") {
    const { name: a } = i;
    return function(l) {
      const o = this[a];
      t.call(this, l), this.requestUpdate(a, o, e, !0, l);
    };
  }
  throw Error("Unsupported decorator location: " + r);
};
function B(e) {
  return (t, i) => typeof i == "object" ? ce(e, t, i) : ((r, s, n) => {
    const a = s.hasOwnProperty(n);
    return s.constructor.createProperty(n, r), a ? Object.getOwnPropertyDescriptor(s, n) : void 0;
  })(e, t, i);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function _(e) {
  return B({ ...e, state: !0, attribute: !1 });
}
const nt = {
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
function Lt(e) {
  var i;
  const t = (((i = e == null ? void 0 : e.locale) == null ? void 0 : i.language) ?? (e == null ? void 0 : e.language) ?? "en").split("-")[0];
  return nt[t] ? t : "en";
}
function g(e, t, i) {
  let r = nt[Lt(e)][t] ?? nt.en[t] ?? t;
  if (i) for (const [s, n] of Object.entries(i)) r = r.replace(`{${s}}`, String(n));
  return r;
}
function le(e, t) {
  return t < 48 ? g(e, "range_h", { n: t }) : g(e, "range_d", { n: Math.round(t / 24) });
}
function de(e, t) {
  return t <= 48 ? g(e, "last_hours", { n: t }) : g(e, "last_days", { n: Math.round(t / 24) });
}
function at(e) {
  var t;
  return ((t = e == null ? void 0 : e.locale) == null ? void 0 : t.language) ?? (e == null ? void 0 : e.language) ?? "en";
}
function f(e, t, i = 0) {
  return Number.isFinite(e) ? e.toLocaleString(at(t), {
    minimumFractionDigits: i,
    maximumFractionDigits: i
  }) : "–";
}
function pe(e, t, i) {
  if (!Number.isFinite(e)) return "–";
  let s = e * ({
    b: 1,
    kb: 1e3,
    mb: 1e6,
    gb: 1e9,
    tb: 1e12
  }[(i ?? "b").toLowerCase()] ?? 1);
  const n = ["B", "KB", "MB", "GB", "TB", "PB"];
  let a = 0;
  for (; s >= 1e3 && a < n.length - 1; )
    s /= 1e3, a++;
  return `${f(s, t, s >= 100 ? 0 : 1)} ${n[a]}`;
}
function Ut(e, t) {
  return Number.isFinite(e) ? e >= 1e3 ? `${f(e / 1e3, t, 1)} Mbps` : `${f(e, t, 0)} kbps` : "–";
}
function F(e) {
  if (!Number.isFinite(e) || e < 0) return "0:00";
  const t = Math.floor(e % 60), i = Math.floor(e / 60 % 60), r = Math.floor(e / 3600), s = r ? String(i).padStart(2, "0") : String(i);
  return `${r ? `${r}:` : ""}${s}:${String(t).padStart(2, "0")}`;
}
function he(e, t) {
  if (!Number.isFinite(e)) return "–";
  const i = Math.floor(e / 60), r = Math.round(e % 60);
  return i ? r ? `${f(i, t)} h ${r} min` : `${f(i, t)} h` : `${r} min`;
}
function ue(e, t) {
  if (!Number.isFinite(e)) return "";
  const i = new Intl.RelativeTimeFormat(at(t), { numeric: "auto" }), r = (e - Date.now()) / 1e3, s = Math.abs(r);
  return s < 3600 ? i.format(Math.round(r / 60), "minute") : s < 86400 ? i.format(Math.round(r / 3600), "hour") : s < 86400 * 30 ? i.format(Math.round(r / 86400), "day") : new Date(e).toLocaleDateString(at(t), {
    day: "numeric",
    month: "short"
  });
}
const q = ["playing", "buffering", "paused"];
function V(e, t, i) {
  var s;
  if ((s = t.players) != null && s.length)
    return t.players.map((n) => e.states[n]).filter((n) => !!n && q.includes(n.state));
  const r = (t.match ?? i).toLowerCase();
  return Object.values(e.states).filter(
    (n) => n.entity_id.startsWith("media_player.") && q.includes(n.state) && (n.entity_id.toLowerCase().includes(r) || String(n.attributes.app_name ?? "").toLowerCase().includes(r) || String(n.attributes.friendly_name ?? "").toLowerCase().includes(r))
  ).sort(
    (n, a) => q.indexOf(n.state) - q.indexOf(a.state) || n.entity_id.localeCompare(a.entity_id)
  );
}
function me(e) {
  if (!e) return;
  const t = e.match(/\(([^)]+)\)\s*$/);
  return t ? t[1] : e;
}
function ge(e) {
  const t = e.attributes, i = t.media_content_type;
  let r = t.media_title ?? "", s;
  i === "tvshow" || i === "episode" || t.media_series_title ? (r = t.media_series_title ?? r, s = [t.media_season != null && t.media_episode != null ? `S${t.media_season} · E${t.media_episode}` : void 0, t.media_title].filter(Boolean).join(" · ")) : i === "music" || t.media_artist ? (r = t.media_title ?? "", s = [t.media_artist, t.media_album_name].filter(Boolean).join(" · ")) : t.media_year && (s = String(t.media_year));
  const n = t.media_position_updated_at;
  return {
    entityId: e.entity_id,
    state: e.state,
    user: t.username ?? t.session_username ?? t.user ?? void 0,
    title: r || (t.friendly_name ?? e.entity_id),
    subline: s,
    mediaType: i,
    poster: t.entity_picture ?? void 0,
    device: t.app_name ?? me(t.friendly_name),
    position: typeof t.media_position == "number" ? t.media_position : void 0,
    duration: typeof t.media_duration == "number" ? t.media_duration : void 0,
    positionUpdatedAt: n ? Date.parse(n) : void 0
  };
}
function fe(e) {
  if (e.position == null) return;
  if (e.state !== "playing" || !e.positionUpdatedAt) return e.position;
  const t = e.position + (Date.now() - e.positionUpdatedAt) / 1e3;
  return e.duration != null ? Math.min(t, e.duration) : t;
}
function be(e) {
  if (!e) return [];
  let t = e.attributes.data ?? e.attributes.items ?? e.attributes.entries;
  if (typeof t == "string")
    try {
      t = JSON.parse(t);
    } catch {
      return [];
    }
  return Array.isArray(t) ? t.filter((i) => i && typeof i == "object" && !("title_default" in i) && (i.title || i.name)).map((i) => {
    const r = i.added ?? i.aired ?? i.release ?? i.airdate;
    let s;
    if (typeof r == "number") s = r < 1e12 ? r * 1e3 : r;
    else if (typeof r == "string") {
      const a = Date.parse(r);
      s = Number.isFinite(a) ? a : void 0;
    }
    const n = i.number ?? (i.season != null && i.episode != null ? `S${i.season} · E${i.episode}` : void 0);
    return {
      title: i.title ?? i.name,
      subline: [n, i.episode_title ?? i.episode_name].filter(Boolean).join(" · ") || (i.year ? String(i.year) : void 0),
      poster: i.poster ?? i.thumb ?? i.image ?? i.fanart,
      added: s,
      type: i.type ?? (n ? "episode" : "movie")
    };
  }) : [];
}
const X = (e) => e.replace(/\/+$/, "");
function _e(e, t, i, r = 320, s = 480) {
  return `${X(e)}/photo/:/transcode?width=${r}&height=${s}&minSize=1&upscale=1&url=${encodeURIComponent(i)}&X-Plex-Token=${encodeURIComponent(t)}`;
}
async function ye(e, t, i) {
  var l;
  const r = `${X(e)}/library/recentlyAdded?X-Plex-Container-Start=0&X-Plex-Container-Size=${i}&X-Plex-Token=${encodeURIComponent(t)}`, s = await fetch(r, { headers: { Accept: "application/json" } });
  if (!s.ok) throw new Error(`Plex ${s.status}`);
  const n = await s.json();
  return (((l = n == null ? void 0 : n.MediaContainer) == null ? void 0 : l.Metadata) ?? []).slice(0, i).map((o) => {
    const d = o.type === "episode" || o.type === "season", h = (d ? o.grandparentTitle ?? o.parentTitle : o.title) ?? o.title ?? "", m = o.type === "episode" && o.parentIndex != null && o.index != null ? `S${o.parentIndex} · E${o.index}` : o.type === "season" ? o.title : void 0, u = (d ? o.grandparentThumb ?? o.parentThumb ?? o.thumb : o.thumb) ?? o.thumb;
    return {
      title: h,
      subline: m ?? (o.year ? String(o.year) : void 0),
      poster: u ? _e(e, t, u) : void 0,
      added: o.addedAt ? o.addedAt * 1e3 : void 0,
      type: o.type
    };
  });
}
async function ve(e, t, i, r) {
  const s = X(e), n = r ? `${s}/Users/${encodeURIComponent(r)}/Items/Latest?Limit=${i}&Fields=DateCreated` : `${s}/Items?SortBy=DateCreated&SortOrder=Descending&Recursive=true&Limit=${i}&IncludeItemTypes=Movie,Series,Episode&Fields=DateCreated`, a = await fetch(n, {
    headers: { Accept: "application/json", "X-Emby-Token": t }
  });
  if (!a.ok) throw new Error(`Jellyfin ${a.status}`);
  const l = await a.json();
  return (Array.isArray(l) ? l : (l == null ? void 0 : l.Items) ?? []).slice(0, i).map((d) => {
    var k, ut;
    const h = d.Type === "Episode", m = h && d.SeriesPrimaryImageTag ? d.SeriesId : d.Id, u = h && d.SeriesPrimaryImageTag ? d.SeriesPrimaryImageTag : (k = d.ImageTags) == null ? void 0 : k.Primary, b = h && d.ParentIndexNumber != null && d.IndexNumber != null ? `S${d.ParentIndexNumber} · E${d.IndexNumber}` : void 0;
    return {
      title: (h ? d.SeriesName : d.Name) ?? d.Name ?? "",
      subline: b ?? (d.ProductionYear ? String(d.ProductionYear) : void 0),
      poster: u ? `${s}/Items/${m}/Images/Primary?maxWidth=320&tag=${u}&api_key=${encodeURIComponent(t)}` : void 0,
      added: d.DateCreated ? Date.parse(d.DateCreated) : void 0,
      type: (ut = d.Type) == null ? void 0 : ut.toLowerCase()
    };
  });
}
async function xe(e, t) {
  const i = await fetch(`${X(e)}/api/v1/request/count`, {
    headers: { Accept: "application/json", "X-Api-Key": t }
  });
  if (!i.ok) throw new Error(`Overseerr ${i.status}`);
  return await i.json();
}
async function St(e, t, i) {
  const r = /* @__PURE__ */ new Date(), s = new Date(r.getTime() - i * 36e5), n = await e.callWS({
    type: "history/history_during_period",
    start_time: s.toISOString(),
    end_time: r.toISOString(),
    entity_ids: [t],
    minimal_response: !0,
    no_attributes: !0
  });
  return ((n == null ? void 0 : n[t]) ?? []).map((a) => ({ t: a.lu * 1e3, v: parseFloat(a.s) })).filter((a) => Number.isFinite(a.v));
}
async function $e(e, t, i) {
  const r = /* @__PURE__ */ new Date();
  r.setHours(0, 0, 0, 0), r.setDate(r.getDate() - (i - 1));
  const s = await e.callWS({
    type: "recorder/statistics_during_period",
    start_time: r.toISOString(),
    end_time: (/* @__PURE__ */ new Date()).toISOString(),
    statistic_ids: [t],
    period: "day",
    types: ["max", "mean"]
  });
  return ((s == null ? void 0 : s[t]) ?? []).map((n) => ({
    t: typeof n.start == "number" ? n.start : Date.parse(String(n.start)),
    v: typeof n.max == "number" ? n.max : typeof n.mean == "number" ? n.mean : NaN
  })).filter((n) => Number.isFinite(n.t) && Number.isFinite(n.v));
}
async function Ht(e, t, i) {
  if (i <= 168) return St(e, t, i);
  const r = await $e(e, t, i / 24).catch(
    () => []
  );
  return r.length ? r : St(e, t, i);
}
function jt(e, t, i) {
  const r = Date.now(), s = r - t * 36e5, n = new Array(i).fill(NaN), a = [...e].sort((d, h) => d.t - h.t);
  let l = 0;
  for (const d of a)
    if (d.t < s) l = d.v;
    else {
      const h = Math.min(i - 1, Math.floor((d.t - s) / (r - s) * i));
      n[h] = Number.isFinite(n[h]) ? Math.max(n[h], d.v) : d.v;
    }
  let o = l;
  for (let d = 0; d < i; d++)
    Number.isFinite(n[d]) ? o = n[d] : n[d] = o;
  return n;
}
function Bt(e, t) {
  const r = t.height ?? 110, s = t.grid ? 16 : 2, n = Math.max(2, Math.ceil(Math.max(...e, 0))), a = e.length, l = (u) => a > 1 ? u / (a - 1) * 480 : 0, o = (u) => (r - s) * (1 - Math.max(0, u) / n) + 2;
  let d = `M0 ${o(e[0] ?? 0)}`;
  for (let u = 1; u < a; u++) d += ` L${l(u)} ${o(e[u - 1])} L${l(u)} ${o(e[u])}`;
  const h = `${d} L480 ${r - s} L0 ${r - s} Z`, m = [];
  if (t.grid) {
    const u = n <= 6 ? 1 : Math.ceil(n / 4);
    for (let b = u; b <= n; b += u) m.push(b);
  }
  return c`
    <svg viewBox="0 0 ${480} ${r}" preserveAspectRatio="none">
      <defs>
        <linearGradient id=${t.id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color=${t.accent} stop-opacity="0.45" />
          <stop offset="1" stop-color=${t.accent} stop-opacity="0.02" />
        </linearGradient>
      </defs>
      ${m.map(
    (u) => st`<line class="grid" x1="0" y1=${o(u)} x2=${480} y2=${o(u)} />
          <text class="gridlabel" x="4" y=${o(u) - 3}>${u}</text>`
  )}
      <path d=${h} fill="url(#${t.id})" />
      <path d=${d} fill="none" stroke=${t.accent} stroke-width="2" vector-effect="non-scaling-stroke" />
      ${t.dot !== !1 ? st`<circle cx=${480} cy=${o(e[a - 1] ?? 0)} r="3.5" fill=${t.accent} />` : we()}
    </svg>
  `;
}
function we() {
  return st``;
}
const At = {
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
function ot(e, t) {
  const i = At[e ?? "plex"] ?? At.plex;
  return t ? { ...i, accent: t, accent2: t } : i;
}
var ke = Object.defineProperty, Se = Object.getOwnPropertyDescriptor, Q = (e, t, i, r) => {
  for (var s = r > 1 ? void 0 : r ? Se(t, i) : t, n = e.length - 1, a; n >= 0; n--)
    (a = e[n]) && (s = (r ? a(t, i, s) : a(s)) || s);
  return r && s && ke(t, i, s), s;
};
const Ae = [
  "now_playing",
  "stats",
  "recently_added",
  "activity",
  "top",
  "requests",
  "custom"
], Ee = {
  now_playing: "mdi:play-box-multiple",
  stats: "mdi:bookshelf",
  recently_added: "mdi:new-box",
  activity: "mdi:chart-areaspline",
  top: "mdi:trophy-outline",
  requests: "mdi:message-plus-outline",
  custom: "mdi:gauge"
}, Ce = ["stats", "top", "requests", "custom"], Et = {
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
let z = class extends $ {
  constructor() {
    super(...arguments), this._expanded = -1;
  }
  setConfig(e) {
    this._config = { ...e, sections: e.sections ?? [] };
  }
  _label(e) {
    var i;
    const t = Lt(this.hass);
    return ((i = Et[t]) == null ? void 0 : i[e]) ?? Et.en[e] ?? e;
  }
  _emit(e) {
    this._config = e, this.dispatchEvent(
      new CustomEvent("config-changed", {
        detail: { config: e },
        bubbles: !0,
        composed: !0
      })
    );
  }
  /* ---- top level -------------------------------------------------------- */
  _topSchema() {
    const e = (t, i) => t.map((r) => ({ value: r, label: this._label(`${i}_${r}`) }));
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
                options: e(["plex", "jellyfin", "emby", "tautulli", "neutral"], "brand")
              }
            }
          },
          {
            name: "card_style",
            selector: {
              select: {
                mode: "dropdown",
                options: e(["default", "glass", "material", "bubble", "mirror"], "style")
              }
            }
          }
        ]
      },
      { name: "status_entity", selector: { entity: {} } },
      { name: "accent", selector: { text: {} } },
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
  _topChanged(e) {
    if (e.stopPropagation(), !this._config) return;
    const t = e.detail.value, i = { ...this._config, ...t };
    for (const r of ["title", "subtitle", "accent", "status_entity"])
      (i[r] === "" || i[r] === void 0) && delete i[r];
    i.brand === "plex" && delete i.brand, i.card_style === "default" && delete i.card_style, i.background === !0 && delete i.background, i.flush === !1 && delete i.flush, this._emit(i);
  }
  /* ---- sections --------------------------------------------------------- */
  _sectionSchema(e) {
    const t = e.type, i = [
      {
        type: "grid",
        name: "",
        schema: [
          {
            name: "type",
            selector: {
              select: {
                mode: "dropdown",
                options: Ae.map((r) => ({ value: r, label: g(this.hass, r) }))
              }
            }
          },
          { name: "title", selector: { text: {} } }
        ]
      }
    ];
    switch (t) {
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
          ...e.api === "jellyfin" ? [{ name: "user_id", selector: { text: {} } }] : []
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
          ...t === "stats" || t === "custom" ? [{ name: "columns", selector: { number: { min: 1, max: 4, mode: "box" } } }] : []
        ];
    }
  }
  _sectionChanged(e, t) {
    if (e.stopPropagation(), !this._config) return;
    const i = e.detail.value, r = { ...this._config.sections[t], ...i };
    for (const [n, a] of Object.entries(r))
      (a === "" || a === void 0) && delete r[n];
    i.title === "" && this._config.sections[t].title && (r.title = "");
    const s = [...this._config.sections];
    s[t] = r, this._emit({ ...this._config, sections: s });
  }
  /* ---- row list (stats/top/requests/custom entities) --------------------- */
  _rows(e) {
    return ((e.type === "stats" || e.type === "custom" ? e.stats ?? e.entities : e.entities ?? e.stats) ?? []).map((i) => typeof i == "string" ? { entity: i } : i);
  }
  _rowKey(e) {
    return (e.type === "stats" || e.type === "custom") && !e.entities ? "stats" : "entities";
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
  _rowChanged(e, t, i) {
    if (e.stopPropagation(), !this._config) return;
    const r = e.detail.value, s = {};
    r.entity && (s.entity = r.entity), r.name && (s.name = r.name), r.icon && (s.icon = r.icon), r.format && r.format !== "auto" && (s.format = r.format);
    const n = this._config.sections[t], a = this._rowKey(n), l = [...this._rows(n)];
    l[i] = Object.keys(s).length === 1 && s.entity ? s.entity : s;
    const o = [...this._config.sections];
    o[t] = { ...n, [a]: l }, this._emit({ ...this._config, sections: o });
  }
  _addRow(e) {
    if (!this._config) return;
    const t = this._config.sections[e], i = this._rowKey(t), r = [...this._rows(t), { entity: "" }], s = [...this._config.sections];
    s[e] = { ...t, [i]: r }, this._emit({ ...this._config, sections: s });
  }
  _removeRow(e, t) {
    if (!this._config) return;
    const i = this._config.sections[e], r = this._rowKey(i), s = this._rows(i).filter((a, l) => l !== t), n = [...this._config.sections];
    n[e] = { ...i, [r]: s }, this._emit({ ...this._config, sections: n });
  }
  /* ---- add / move / remove sections -------------------------------------- */
  _addSection() {
    if (!this._config) return;
    const e = [...this._config.sections, { type: "stats" }];
    this._emit({ ...this._config, sections: e }), this._expanded = e.length - 1;
  }
  _move(e, t, i) {
    if (e.stopPropagation(), !this._config) return;
    const r = [...this._config.sections], s = t + i;
    s < 0 || s >= r.length || ([r[t], r[s]] = [r[s], r[t]], this._emit({ ...this._config, sections: r }), this._expanded = s);
  }
  _remove(e, t) {
    if (e.stopPropagation(), !this._config) return;
    const i = this._config.sections.filter((r, s) => s !== t);
    this._emit({ ...this._config, sections: i }), this._expanded === t && (this._expanded = -1);
  }
  /* ---- render ------------------------------------------------------------- */
  render() {
    return !this.hass || !this._config ? p : c`
      <ha-form
        .hass=${this.hass}
        .data=${{ brand: "plex", card_style: "default", background: !0, flush: !1, ...this._config }}
        .schema=${this._topSchema()}
        .computeLabel=${(e) => this._label(e.name)}
        @value-changed=${this._topChanged}
      ></ha-form>

      <div class="sections">
        ${this._config.sections.map((e, t) => this._renderSectionEditor(e, t))}
      </div>

      <button class="add" @click=${this._addSection}>
        <ha-icon icon="mdi:plus"></ha-icon>
        ${this._label("add_section")}
      </button>
    `;
  }
  _renderSectionEditor(e, t) {
    const i = this._expanded === t, r = this._config.sections.length;
    return c`
      <div class="section ${i ? "open" : ""}">
        <div class="section-head" @click=${() => this._expanded = i ? -1 : t}>
          <span class="chip"><ha-icon .icon=${e.icon ?? Ee[e.type] ?? "mdi:card"}></ha-icon></span>
          <span class="section-title">
            ${e.title || g(this.hass, e.type)}
            <span class="section-type">${e.type}</span>
          </span>
          <button class="icon-btn" .disabled=${t === 0} title="↑" @click=${(s) => this._move(s, t, -1)}>
            <ha-icon icon="mdi:chevron-up"></ha-icon>
          </button>
          <button class="icon-btn" .disabled=${t === r - 1} title="↓" @click=${(s) => this._move(s, t, 1)}>
            <ha-icon icon="mdi:chevron-down"></ha-icon>
          </button>
          <button class="icon-btn danger" @click=${(s) => this._remove(s, t)}>
            <ha-icon icon="mdi:delete-outline"></ha-icon>
          </button>
          <ha-icon class="expand" icon=${i ? "mdi:chevron-up" : "mdi:chevron-down"}></ha-icon>
        </div>
        ${i ? c`<div class="section-body">
              ${e.type === "requests" ? c`<div class="hint">${this._label("seerr_hint")}</div>` : p}
              <ha-form
                .hass=${this.hass}
                .data=${{ layout: "full", show_idle: !0, api: "plex", ...e }}
                .schema=${this._sectionSchema(e)}
                .computeLabel=${(s) => s.name === "title" ? this._label("section_title") : this._label(s.name)}
                @value-changed=${(s) => this._sectionChanged(s, t)}
              ></ha-form>
              ${Ce.includes(e.type) ? this._renderRowEditor(e, t) : p}
            </div>` : p}
      </div>
    `;
  }
  _renderRowEditor(e, t) {
    const i = this._rows(e);
    return c`
      <div class="sub-editor">
        ${i.map(
      (r, s) => c`
            <div class="sub-row">
              <ha-form
                .hass=${this.hass}
                .data=${{ format: "auto", ...r }}
                .schema=${this._rowSchema()}
                .computeLabel=${(n) => this._label(n.name)}
                @value-changed=${(n) => this._rowChanged(n, t, s)}
              ></ha-form>
              <button class="icon-btn danger" title="✕" @click=${() => this._removeRow(t, s)}>
                <ha-icon icon="mdi:delete-outline"></ha-icon>
              </button>
            </div>
          `
    )}
        <button class="add small" @click=${() => this._addRow(t)}>
          <ha-icon icon="mdi:plus"></ha-icon>
          ${this._label("add_row")}
        </button>
      </div>
    `;
  }
};
z.styles = dt`
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
  B({ attribute: !1 })
], z.prototype, "hass", 2);
Q([
  _()
], z.prototype, "_config", 2);
Q([
  _()
], z.prototype, "_expanded", 2);
z = Q([
  Z("plexglass-card-editor")
], z);
var Pe = Object.defineProperty, Ne = Object.getOwnPropertyDescriptor, w = (e, t, i, r) => {
  for (var s = r > 1 ? void 0 : r ? Ne(t, i) : t, n = e.length - 1, a; n >= 0; n--)
    (a = e[n]) && (s = (r ? a(t, i, s) : a(s)) || s);
  return r && s && Pe(t, i, s), s;
};
const Te = ["default", "glass", "material", "bubble", "mirror"], Me = 32, Re = 5 * 60 * 1e3;
let P = class extends $ {
  constructor() {
    super(...arguments), this._sparkAt = 0, this._busy = !1;
  }
  setConfig(e) {
    this._config = e, this._spark = void 0, this._sparkAt = 0;
  }
  getCardSize() {
    return 1;
  }
  static getConfigElement() {
    return document.createElement("plexglass-mini-card-editor");
  }
  static getStubConfig(e) {
    const i = Object.keys((e == null ? void 0 : e.states) ?? {}).find(
      (r) => r.includes("tautulli") && r.includes("stream_count") && !r.includes("direct") && !r.includes("transcode")
    );
    return { title: "Plex", brand: "plex", ...i ? { count_entity: i } : {} };
  }
  updated(e) {
    if (super.updated(e), !this.hass || !this._config) return;
    const t = this._sparkEntity();
    if (!t) return;
    const i = Date.now();
    if (this._busy || this._spark && i - this._sparkAt < Re) return;
    this._busy = !0;
    const r = this._config.hours ?? 24;
    Ht(this.hass, t, r).then((s) => {
      this._spark = jt(s, r, Me), this._sparkAt = Date.now(), this._busy = !1;
    }).catch(() => {
      this._busy = !1, this._sparkAt = Date.now();
    });
  }
  _sparkEntity() {
    var e, t;
    return ((e = this._config) == null ? void 0 : e.entity) ?? ((t = this._config) == null ? void 0 : t.count_entity);
  }
  _num(e) {
    if (!e) return NaN;
    const t = this.hass.states[e];
    return t ? typeof t.state == "number" ? t.state : parseFloat(t.state) : NaN;
  }
  _count() {
    const e = this._config, t = this._num(e.count_entity);
    return Number.isFinite(t) ? t : V(this.hass, { match: e.match }, ot(e.brand).match).length;
  }
  _cardStyle() {
    var t;
    const e = ((t = this._config) == null ? void 0 : t.card_style) ?? "default";
    return Te.includes(e) ? e : "default";
  }
  _moreInfo() {
    var t, i;
    const e = ((t = this._config) == null ? void 0 : t.count_entity) ?? ((i = this._config) == null ? void 0 : i.entity);
    e && this.dispatchEvent(new CustomEvent("hass-more-info", { detail: { entityId: e }, bubbles: !0, composed: !0 }));
  }
  render() {
    if (!this.hass || !this._config) return p;
    const e = this._config, t = ot(e.brand, e.accent), i = this._count(), r = this._num(e.direct_entity), s = this._num(e.transcode_entity), n = this._num(e.bandwidth_entity), a = e.status_entity ? this.hass.states[e.status_entity] : void 0, l = a ? !["off", "unavailable", "unknown", "0"].includes(a.state) : void 0, o = Number.isFinite(i) && i > 0, d = ["mini", `s-${this._cardStyle()}`].join(" "), h = `--pg-accent:${t.accent};--pg-accent2:${t.accent2};`, m = c`
      <div class="mini-inner" @click=${() => this._moreInfo()}>
        <div class="brandmark ${o ? "" : "idle"}">
          <svg viewBox="0 0 24 24"><path d="M8 5.5v13l10-6.5z" /></svg>
        </div>
        <div class="mini-body">
          <div class="mini-top">
            <span class="mini-title">${e.title ?? "Plex"}</span>
            ${l !== void 0 ? c`<span class="statusdot ${l ? "on" : "off"}"></span>` : p}
          </div>
          <div class="mini-chips">
            ${Number.isFinite(r) && r > 0 ? c`<span class="mchip good"><ha-icon icon="mdi:play-speed"></ha-icon>${f(r, this.hass)}</span>` : p}
            ${Number.isFinite(s) && s > 0 ? c`<span class="mchip warn"><ha-icon icon="mdi:cog-transfer-outline"></ha-icon>${f(s, this.hass)}</span>` : p}
            ${Number.isFinite(n) && n > 0 ? c`<span class="mchip"><ha-icon icon="mdi:speedometer"></ha-icon>${Ut(n, this.hass)}</span>` : p}
            ${o ? p : c`<span class="mchip">${g(this.hass, "nothing_playing")}</span>`}
          </div>
        </div>
        <div class="mini-count ${o ? "active" : ""}">
          <span class="mini-num">${Number.isFinite(i) ? f(i, this.hass) : "–"}</span>
          <span class="mini-unit">${i === 1 ? g(this.hass, "stream") : g(this.hass, "streams")}</span>
        </div>
      </div>
      ${this._spark && this._spark.some((u) => u > 0) ? c`<div class="mini-spark">
            ${Bt(this._spark, { id: "pg-mini-spark", accent: t.accent, height: 40, grid: !1, dot: !1 })}
          </div>` : p}
    `;
    return e.background === !1 ? c`<div class="${d} nobg" style=${h}>${m}</div>` : c`<ha-card class=${d} style=${h}>${m}</ha-card>`;
  }
};
P.styles = dt`
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
  B({ attribute: !1 })
], P.prototype, "hass", 2);
w([
  _()
], P.prototype, "_config", 2);
w([
  _()
], P.prototype, "_spark", 2);
w([
  _()
], P.prototype, "_sparkAt", 2);
P = w([
  Z("plexglass-mini-card")
], P);
const Ct = {
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
}, ze = ["plex", "jellyfin", "emby", "tautulli", "neutral"], Oe = ["default", "glass", "material", "bubble", "mirror"];
let G = class extends $ {
  setConfig(e) {
    this._config = e;
  }
  _label(e) {
    var i, r, s, n;
    const t = (((r = (i = this.hass) == null ? void 0 : i.locale) == null ? void 0 : r.language) ?? ((s = this.hass) == null ? void 0 : s.language) ?? "en").split("-")[0];
    return ((n = Ct[t]) == null ? void 0 : n[e]) ?? Ct.en[e] ?? e;
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
            selector: { select: { mode: "dropdown", options: ze.map((e) => ({ value: e, label: Pt(e) })) } }
          },
          {
            name: "card_style",
            selector: { select: { mode: "dropdown", options: Oe.map((e) => ({ value: e, label: Pt(e) })) } }
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
  _changed(e) {
    if (e.stopPropagation(), !this._config) return;
    const t = e.detail.value, i = { ...this._config, ...t };
    for (const [r, s] of Object.entries(i))
      (s === "" || s === void 0) && delete i[r];
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
        .computeLabel=${(e) => this._label(e.name)}
        @value-changed=${this._changed}
      ></ha-form>
    `;
  }
};
w([
  B({ attribute: !1 })
], G.prototype, "hass", 2);
w([
  _()
], G.prototype, "_config", 2);
G = w([
  Z("plexglass-mini-card-editor")
], G);
function Pt(e) {
  return e.charAt(0).toUpperCase() + e.slice(1);
}
window.customCards = window.customCards ?? [];
window.customCards.push({
  type: "plexglass-mini-card",
  name: "Plexglass Mini",
  description: "Compact current-activity badge: stream count, direct/transcode, bandwidth and a sparkline.",
  preview: !0
});
var De = Object.defineProperty, Ie = Object.getOwnPropertyDescriptor, N = (e, t, i, r) => {
  for (var s = r > 1 ? void 0 : r ? Ie(t, i) : t, n = e.length - 1, a; n >= 0; n--)
    (a = e[n]) && (s = (r ? a(t, i, s) : a(s)) || s);
  return r && s && De(t, i, s), s;
};
const Le = "0.1.0", Ue = ["default", "glass", "material", "bubble", "mirror"], He = 5 * 60 * 1e3, je = 10 * 60 * 1e3, Be = 5 * 60 * 1e3, Fe = 48, Nt = [24, 168, 720, 2160];
let y = class extends $ {
  constructor() {
    super(...arguments), this._historyCache = {}, this._recentCache = {}, this._seerrCache = {}, this._range = {};
  }
  setConfig(e) {
    if (!e || !Array.isArray(e.sections) || !e.sections.length)
      throw new Error("plexglass-card: please define at least one section");
    this._config = e, this._historyCache = {}, this._recentCache = {}, this._seerrCache = {};
  }
  getCardSize() {
    var e;
    return 2 + (((e = this._config) == null ? void 0 : e.sections.length) ?? 0) * 2;
  }
  static getConfigElement() {
    return document.createElement("plexglass-card-editor");
  }
  static getStubConfig(e) {
    const i = Object.keys((e == null ? void 0 : e.states) ?? {}).find((s) => s.includes("tautulli") && s.includes("stream_count") && !s.includes("direct") && !s.includes("transcode")), r = [{ type: "now_playing", ...i ? { count_entity: i } : {} }];
    return i && r.push({ type: "activity", entity: i }), { title: "Plex", brand: "plex", sections: r };
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._ticker && (clearInterval(this._ticker), this._ticker = void 0);
  }
  /* ---- data plumbing ---------------------------------------------------- */
  updated(e) {
    super.updated(e), !(!this.hass || !this._config) && (this._syncTicker(), this._maybeFetch());
  }
  /** 1 s re-render tick while something is playing (live progress bars) */
  _syncTicker() {
    var t;
    const e = (((t = this._config) == null ? void 0 : t.sections) ?? []).some(
      (i) => i.type === "now_playing" && V(this.hass, i, this._brand().match).some((r) => r.state === "playing")
    );
    e && !this._ticker ? this._ticker = window.setInterval(() => this.requestUpdate(), 1e3) : !e && this._ticker && (clearInterval(this._ticker), this._ticker = void 0);
  }
  _maybeFetch() {
    const e = Date.now();
    this._config.sections.forEach((t, i) => {
      if (t.type === "activity") {
        const r = this._activityEntity(t);
        if (!r) return;
        const s = this._activityHours(t, i), n = `${r}|${s}`, a = this._historyCache[n];
        if (a != null && a.busy || a && e - a.at < He) return;
        this._historyCache = { ...this._historyCache, [n]: { ...a, at: e, busy: !0 } }, Ht(this.hass, r, s).then((l) => {
          const o = jt(l, s, Fe);
          this._historyCache = { ...this._historyCache, [n]: { data: o, at: Date.now() } };
        }).catch(() => {
          this._historyCache = { ...this._historyCache, [n]: { error: !0, at: Date.now() } };
        });
      }
      if (t.type === "recently_added" && t.url && t.token) {
        const r = this._recentCache[i];
        if (r != null && r.busy || r && e - r.at < je) return;
        this._recentCache = { ...this._recentCache, [i]: { ...r, at: e, busy: !0 } };
        const s = t.limit ?? 10;
        (t.api === "jellyfin" ? ve(t.url, t.token, s, t.user_id) : ye(t.url, t.token, s)).then((a) => {
          this._recentCache = { ...this._recentCache, [i]: { data: a, at: Date.now() } };
        }).catch(() => {
          this._recentCache = { ...this._recentCache, [i]: { ...this._recentCache[i], error: !0, busy: !1, at: Date.now() } };
        });
      }
      if (t.type === "requests" && t.url && t.token) {
        const r = this._seerrCache[i];
        if (r != null && r.busy || r && e - r.at < Be) return;
        this._seerrCache = { ...this._seerrCache, [i]: { ...r, at: e, busy: !0 } }, xe(t.url, t.token).then((s) => {
          this._seerrCache = { ...this._seerrCache, [i]: { data: s, at: Date.now() } };
        }).catch(() => {
          this._seerrCache = { ...this._seerrCache, [i]: { ...this._seerrCache[i], error: !0, busy: !1, at: Date.now() } };
        });
      }
    });
  }
  _activityEntity(e) {
    var i;
    if (e.entity) return e.entity;
    const t = (i = this._config) == null ? void 0 : i.sections.find((r) => r.type === "now_playing" && r.count_entity);
    return t == null ? void 0 : t.count_entity;
  }
  /** range toggle options for an activity section (empty = no toggle) */
  _activityRanges(e) {
    return e.ranges ? e.ranges : e.hours && !Nt.includes(e.hours) ? [] : Nt;
  }
  /** currently selected window (hours) for an activity section */
  _activityHours(e, t) {
    if (this._range[t] != null) return this._range[t];
    const i = this._activityRanges(e);
    return e.hours ? e.hours : i[0] ?? 24;
  }
  /* ---- helpers ----------------------------------------------------------- */
  _brand() {
    var e, t;
    return ot((e = this._config) == null ? void 0 : e.brand, (t = this._config) == null ? void 0 : t.accent);
  }
  _cardStyle() {
    var t;
    const e = ((t = this._config) == null ? void 0 : t.card_style) ?? "default";
    return Ue.includes(e) ? e : "default";
  }
  _num(e, t) {
    if (!e) return NaN;
    const i = this.hass.states[e];
    if (!i) return NaN;
    const r = t ? i.attributes[t] : i.state;
    return typeof r == "number" ? r : parseFloat(r);
  }
  _stat(e) {
    return typeof e == "string" ? { entity: e } : e;
  }
  _statValue(e) {
    const t = this.hass.states[e.entity];
    if (!t) return "–";
    const i = e.attribute ? t.attributes[e.attribute] : t.state, r = typeof i == "number" ? i : parseFloat(i), s = e.unit ?? t.attributes.unit_of_measurement ?? "";
    switch (e.format ?? (Number.isFinite(r) ? "number" : "text")) {
      case "bytes":
        return pe(r, this.hass, s || "b");
      case "duration":
        return he(r, this.hass);
      case "number":
        return `${f(r, this.hass)}${s ? ` ${s}` : ""}`;
      default:
        return String(i ?? "–");
    }
  }
  _statName(e) {
    if (e.name) return e.name;
    const t = this.hass.states[e.entity];
    return (t == null ? void 0 : t.attributes.friendly_name) ?? e.entity;
  }
  _moreInfo(e) {
    e && this.dispatchEvent(
      new CustomEvent("hass-more-info", {
        detail: { entityId: e },
        bubbles: !0,
        composed: !0
      })
    );
  }
  /* ---- render ------------------------------------------------------------ */
  render() {
    if (!this.hass || !this._config) return p;
    const e = this._config, t = this._brand(), i = ["cardroot", `s-${this._cardStyle()}`, e.flush ? "flush" : ""].join(" "), r = `--pg-accent:${t.accent};--pg-accent2:${t.accent2};`, s = c`
      ${this._renderHeader()}
      <div class="sections">${e.sections.map((n, a) => this._renderSection(n, a))}</div>
    `;
    return e.background === !1 ? c`<div class="${i} nobg" style=${r}>${s}</div>` : c`<ha-card class=${i} style=${r}>${s}</ha-card>`;
  }
  _renderHeader() {
    const e = this._config;
    if (!e.title && !e.subtitle) return p;
    const t = e.status_entity ? this.hass.states[e.status_entity] : void 0, i = t ? !["off", "unavailable", "unknown", "0"].includes(t.state) : void 0;
    return c`
      <div class="header">
        <div class="brandmark">
          <svg viewBox="0 0 24 24"><path d="M8 5.5v13l10-6.5z" /></svg>
        </div>
        <div class="header-text">
          <div class="title">
            ${e.title}
            ${i !== void 0 ? c`<span
                  class="statusdot ${i ? "on" : "off"}"
                  title=${i ? g(this.hass, "online") : g(this.hass, "offline")}
                ></span>` : p}
          </div>
          ${e.subtitle ? c`<div class="subtitle">${e.subtitle}</div>` : p}
        </div>
        ${this._renderHeaderChips()}
      </div>
    `;
  }
  _renderHeaderChips() {
    const e = this._config.sections.find((r) => r.type === "now_playing");
    if (!e) return p;
    const t = Number.isFinite(this._num(e.count_entity)) ? this._num(e.count_entity) : V(this.hass, e, this._brand().match).length, i = this._num(e.bandwidth_entity);
    return c`
      <div class="header-chips">
        <span class="chip accented">
          <ha-icon icon="mdi:play-circle-outline"></ha-icon>
          ${f(t, this.hass)}
          ${t === 1 ? g(this.hass, "stream") : g(this.hass, "streams")}
        </span>
        ${Number.isFinite(i) && i > 0 ? c`<span class="chip">
              <ha-icon icon="mdi:speedometer"></ha-icon>
              ${Ut(i, this.hass)}
            </span>` : p}
      </div>
    `;
  }
  _renderSection(e, t) {
    switch (e.type) {
      case "now_playing":
        return this._renderNowPlaying(e);
      case "stats":
      case "custom":
        return this._renderStats(e);
      case "recently_added":
        return this._renderRecent(e, t);
      case "activity":
        return this._renderActivity(e, t);
      case "top":
        return this._renderTop(e);
      case "requests":
        return this._renderRequests(e, t);
      default:
        return p;
    }
  }
  _sectionHead(e, t, i) {
    const r = e.title ?? g(this.hass, e.type);
    return r === "" ? p : c`
      <div class="sec-head">
        <ha-icon .icon=${e.icon ?? t}></ha-icon>
        <span class="sec-title">${r}</span>
        ${i ?? p}
      </div>
    `;
  }
  /* ---- now playing ------------------------------------------------------- */
  _renderNowPlaying(e) {
    const t = V(this.hass, e, this._brand().match).map(ge), i = this._transcodeChips(e);
    return c`
      <div class="section">
        ${this._sectionHead(e, "mdi:play-box-multiple", i)}
        ${t.length ? c`<div class="streams">
              ${t.map(
      (r) => e.layout === "compact" ? this._streamRow(r) : this._streamCard(r)
    )}
            </div>` : e.show_idle === !1 ? p : c`<div class="idle">
                <ha-icon icon="mdi:filmstrip-off"></ha-icon>
                <div>
                  <div class="idle-title">${g(this.hass, "nothing_playing")}</div>
                  <div class="idle-hint">${g(this.hass, "idle_hint")}</div>
                </div>
              </div>`}
      </div>
    `;
  }
  _transcodeChips(e) {
    const t = this._num(e.direct_entity), i = this._num(e.transcode_entity);
    if (!(!Number.isFinite(t) && !Number.isFinite(i)))
      return c`<span class="sec-chips">
      ${Number.isFinite(t) ? c`<span class="chip good"
            ><ha-icon icon="mdi:play-speed"></ha-icon>${f(t, this.hass)}
            ${g(this.hass, "direct_play")}</span
          >` : p}
      ${Number.isFinite(i) ? c`<span class="chip ${i > 0 ? "warn" : ""}"
            ><ha-icon icon="mdi:cog-transfer-outline"></ha-icon>${f(i, this.hass)}
            ${g(this.hass, "transcode")}</span
          >` : p}
    </span>`;
  }
  _progress(e) {
    const t = fe(e);
    if (!(t == null || !e.duration))
      return { pct: Math.min(100, t / e.duration * 100), pos: t, left: e.duration - t };
  }
  _stateBadge(e) {
    return e.state === "paused" ? c`<span class="chip statechip"><ha-icon icon="mdi:pause"></ha-icon>${g(this.hass, "paused")}</span>` : e.state === "buffering" ? c`<span class="chip statechip"><ha-icon icon="mdi:timer-sand"></ha-icon>${g(this.hass, "buffering")}</span>` : p;
  }
  _avatar(e) {
    return e ? c`<span class="avatar" title=${e}>${e.slice(0, 1).toUpperCase()}</span>` : p;
  }
  _mediaIcon(e) {
    return e.mediaType === "music" ? "mdi:music" : e.mediaType === "episode" || e.mediaType === "tvshow" ? "mdi:television-classic" : "mdi:movie-open";
  }
  _streamCard(e) {
    const t = this._progress(e);
    return c`
      <div class="stream ${e.state}" @click=${() => this._moreInfo(e.entityId)}>
        ${e.poster ? c`<div class="backdrop" style="background-image:url('${e.poster}')"></div>` : p}
        <div class="stream-inner">
          ${e.poster ? c`<img class="poster" src=${e.poster} alt="" loading="lazy" />` : c`<div class="poster poster-empty"><ha-icon .icon=${this._mediaIcon(e)}></ha-icon></div>`}
          <div class="stream-info">
            <div class="stream-title">${e.title}</div>
            ${e.subline ? c`<div class="stream-sub">${e.subline}</div>` : p}
            <div class="stream-meta">
              ${this._avatar(e.user)}
              ${e.user ? c`<span class="username">${e.user}</span>` : p}
              ${e.device ? c`<span class="device"><ha-icon icon="mdi:monitor-small"></ha-icon>${e.device}</span>` : p}
              ${this._stateBadge(e)}
            </div>
            ${t ? c`
                  <div class="progress">
                    <div class="bar"><div class="fill" style="width:${t.pct}%"></div></div>
                    <div class="times">
                      <span>${F(t.pos)}</span>
                      <span>-${F(t.left)}</span>
                    </div>
                  </div>
                ` : p}
          </div>
        </div>
      </div>
    `;
  }
  _streamRow(e) {
    const t = this._progress(e);
    return c`
      <div class="streamrow ${e.state}" @click=${() => this._moreInfo(e.entityId)}>
        ${e.poster ? c`<img class="rowposter" src=${e.poster} alt="" loading="lazy" />` : c`<div class="rowposter poster-empty"><ha-icon .icon=${this._mediaIcon(e)}></ha-icon></div>`}
        <div class="row-info">
          <div class="row-top">
            <span class="stream-title">${e.title}</span>
            ${this._stateBadge(e)}
          </div>
          ${e.subline ? c`<div class="stream-sub">${e.subline}</div>` : p}
          <div class="row-bottom">
            ${this._avatar(e.user)}
            <span class="username">${e.user ?? e.device ?? ""}</span>
            ${t ? c`<span class="row-time">${F(t.pos)} / ${F(e.duration)}</span>` : p}
          </div>
          ${t ? c`<div class="bar slim"><div class="fill" style="width:${t.pct}%"></div></div>` : p}
        </div>
      </div>
    `;
  }
  /* ---- stats / custom ----------------------------------------------------- */
  _renderStats(e) {
    const t = (e.stats ?? e.entities ?? []).map((i) => this._stat(i));
    return c`
      <div class="section">
        ${this._sectionHead(e, e.type === "custom" ? "mdi:gauge" : "mdi:bookshelf")}
        <div class="stat-grid" style="--pg-cols:${e.columns ?? Math.min(3, Math.max(2, t.length))}">
          ${t.map((i) => {
      const r = !this.hass.states[i.entity];
      return c`
              <div class="stat" @click=${() => this._moreInfo(i.entity)}>
                <span class="iconchip" style=${i.color ? `--pg-accent:${i.color};--pg-accent2:${i.color}` : ""}>
                  <ha-icon .icon=${i.icon ?? "mdi:counter"}></ha-icon>
                </span>
                <div class="stat-body">
                  <div class="stat-value">${r ? "–" : this._statValue(i)}</div>
                  <div class="stat-label">${r ? g(this.hass, "entity_missing") : this._statName(i)}</div>
                </div>
              </div>
            `;
    })}
        </div>
      </div>
    `;
  }
  /* ---- recently added ------------------------------------------------------ */
  _renderRecent(e, t) {
    let i = [], r = !1;
    if (e.url && e.token) {
      const s = this._recentCache[t];
      i = (s == null ? void 0 : s.data) ?? [], r = !!(s != null && s.error) && !(s != null && s.data);
    } else
      i = be(e.entity ? this.hass.states[e.entity] : void 0);
    return i = i.slice(0, e.limit ?? 10), c`
      <div class="section">
        ${this._sectionHead(e, "mdi:new-box")}
        ${r ? c`<div class="err">${g(this.hass, "fetch_error")}</div>` : i.length ? c`
                <div class="shelf">
                  ${i.map((s) => {
      const n = s.added != null && Date.now() - s.added < 1728e5;
      return c`
                      <div class="shelf-item" title=${s.title}>
                        <div class="shelf-poster">
                          ${s.poster ? c`<img src=${s.poster} alt="" loading="lazy" />` : c`<ha-icon icon="mdi:movie-open-outline"></ha-icon>`}
                          ${n ? c`<span class="newbadge">${g(this.hass, "new")}</span>` : p}
                        </div>
                        <div class="shelf-title">${s.title}</div>
                        <div class="shelf-sub">
                          ${s.subline ?? ""}${s.added ? c` <span class="shelf-ago">${ue(s.added, this.hass)}</span>` : p}
                        </div>
                      </div>
                    `;
    })}
                </div>
              ` : c`<div class="err soft">${g(this.hass, "no_items")}</div>`}
      </div>
    `;
  }
  /* ---- activity ------------------------------------------------------------ */
  _renderActivity(e, t) {
    const i = this._activityEntity(e), r = this._activityHours(e, t), s = this._activityRanges(e), n = i ? this._historyCache[`${i}|${r}`] : void 0, a = n == null ? void 0 : n.data, l = this._num(i), o = a != null && a.length ? Math.max(...a, Number.isFinite(l) ? l : 0) : NaN, d = c`<span class="sec-chips">
      ${Number.isFinite(l) ? c`<span class="chip accented">${g(this.hass, "now")}: ${f(l, this.hass)}</span>` : p}
      ${Number.isFinite(o) ? c`<span class="chip">${g(this.hass, "peak")}: ${f(o, this.hass)}</span>` : p}
    </span>`;
    return c`
      <div class="section">
        ${this._sectionHead(e, "mdi:chart-areaspline", d)}
        ${s.length > 1 ? c`<div class="rangetabs">
              ${s.map(
      (h) => c`<button
                  class="rangetab ${h === r ? "active" : ""}"
                  @click=${() => this._selectRange(t, h)}
                >
                  ${le(this.hass, h)}
                </button>`
    )}
            </div>` : p}
        ${i ? a ? c`<div class="chart">
                ${Bt(a, {
      id: `pg-area-${t}`,
      accent: e.color ?? "var(--pg-accent)",
      grid: !0
    })}
                <div class="chart-x">
                  <span>${de(this.hass, r)}</span>
                  <span>${g(this.hass, "now")}</span>
                </div>
              </div>` : n != null && n.error ? c`<div class="err soft">${g(this.hass, "no_data")}</div>` : c`<div class="chart loading"></div>` : c`<div class="err soft">${g(this.hass, "entity_missing")}</div>`}
      </div>
    `;
  }
  _selectRange(e, t) {
    this._range = { ...this._range, [e]: t };
  }
  /* ---- top ------------------------------------------------------------------ */
  _renderTop(e) {
    const t = (e.entities ?? e.stats ?? []).map((i) => this._stat(i));
    return c`
      <div class="section">
        ${this._sectionHead(e, "mdi:trophy-outline")}
        <div class="toplist">
          ${t.map((i, r) => {
      const s = this.hass.states[i.entity];
      return c`
              <div class="toprow" @click=${() => this._moreInfo(i.entity)}>
                <span class="rank r${r + 1}">${r + 1}</span>
                <span class="iconchip small"><ha-icon .icon=${i.icon ?? "mdi:star"}></ha-icon></span>
                <div class="top-body">
                  <div class="top-value">${s ? this._statValue(i) : "–"}</div>
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
  _renderRequests(e, t) {
    if (e.url && e.token) {
      const i = this._seerrCache[t], r = i == null ? void 0 : i.data, s = [
        { key: "pending", icon: "mdi:clock-outline", cls: "warn" },
        { key: "approved", icon: "mdi:check-circle-outline", cls: "good" },
        { key: "processing", icon: "mdi:progress-download" },
        { key: "available", icon: "mdi:play-circle-outline", cls: "good" }
      ];
      return c`
        <div class="section">
          ${this._sectionHead(e, "mdi:message-plus-outline")}
          ${r ? c`<div class="stat-grid" style="--pg-cols:${e.columns ?? 4}">
                ${s.filter((n) => r[n.key] != null).map(
        (n) => c`
                      <div class="stat">
                        <span class="iconchip ${n.cls ?? ""}"><ha-icon .icon=${n.icon}></ha-icon></span>
                        <div class="stat-body">
                          <div class="stat-value">${f(r[n.key], this.hass)}</div>
                          <div class="stat-label">${g(this.hass, n.key)}</div>
                        </div>
                      </div>
                    `
      )}
              </div>` : c`<div class="err ${i != null && i.error ? "" : "soft"}">
                ${i != null && i.error ? g(this.hass, "fetch_error") : g(this.hass, "no_data")}
              </div>`}
        </div>
      `;
    }
    return this._renderStats({ ...e, stats: e.entities ?? e.stats ?? [] });
  }
};
y.styles = dt`
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

    @media (max-width: 460px) {
      .stat-grid {
        grid-template-columns: repeat(2, 1fr);
      }
      .header-chips .chip:not(.accented) {
        display: none;
      }
    }
  `;
N([
  B({ attribute: !1 })
], y.prototype, "hass", 2);
N([
  _()
], y.prototype, "_config", 2);
N([
  _()
], y.prototype, "_historyCache", 2);
N([
  _()
], y.prototype, "_recentCache", 2);
N([
  _()
], y.prototype, "_seerrCache", 2);
N([
  _()
], y.prototype, "_range", 2);
y = N([
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
  `%c PLEXGLASS %c v${Le} `,
  "background:#e5a00d;color:#1f1f1f;font-weight:700;border-radius:4px 0 0 4px;padding:2px 6px;",
  "background:#282a2d;color:#e5a00d;border-radius:0 4px 4px 0;padding:2px 6px;"
);
export {
  y as PlexglassCard
};
