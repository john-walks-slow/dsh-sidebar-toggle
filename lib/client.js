window.__ModuleLoader__.load({
  id: "dsh-sidebar-toggle",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;
    Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
/**
 * Browser half of dsh-sidebar-toggle.
 *  1. Alt+R — toggle sidebar grouping (workspace / flat)
 *  2. Click section header title (会话 / 工作区 / Sessions / Workspaces) — toggle sidebar grouping
 */

var name = 'sidebar-toggle'
var inject = ['slots']
var WINDOW_KEY = '__dshSidebarToggle'
var STYLE_ID = 'dsh-sidebar-toggle-style'

function apply(ctx) {
  var g = globalThis
  if (g[WINDOW_KEY]) { try { g[WINDOW_KEY].dispose() } catch (e) {} }

  var disposers = []
  var disposed = false

  // Inject pointer cursor style for sidebar section header title
  if (typeof document !== 'undefined' && document.head) {
    var existing = document.getElementById(STYLE_ID)
    if (existing) existing.remove()
    var style = document.createElement('style')
    style.id = STYLE_ID
    style.textContent = '[class*="sectionHeader"] [class*="sectionLabel"] { cursor: pointer; user-select: none; }\n[class*="sectionHeader"] [class*="sectionLabel"]:hover { opacity: 0.8; }'
    document.head.appendChild(style)
    disposers.push(function () {
      if (style.parentNode) style.parentNode.removeChild(style)
    })
  }

  // 1. Alt+R shortcut
  var onKeyDown = function (e) {
    if (e.isComposing || e.keyCode === 229) return
    if (!e.altKey || !e.key || e.key.toLowerCase() !== 'r') return
    e.preventDefault()
    toggleGroupBy(ctx)
  }
  document.addEventListener('keydown', onKeyDown, true)
  disposers.push(function () { document.removeEventListener('keydown', onKeyDown, true) })

  // 2. Click header text (会话 / 工作区) to toggle
  var onClick = function (e) {
    var target = e.target
    if (!target || typeof target.closest !== 'function') return
    var label = target.closest('[class*="sectionHeader"] [class*="sectionLabel"]')
    if (!label) return
    if (String(label.className || '').indexOf('sectionLabelHidden') !== -1) return
    e.preventDefault()
    e.stopPropagation()
    toggleGroupBy(ctx)
  }
  document.addEventListener('click', onClick, true)
  disposers.push(function () { document.removeEventListener('click', onClick, true) })

  function dispose() {
    if (disposed) return
    disposed = true
    for (var i = 0; i < disposers.length; i++) { try { disposers[i]() } catch (e) {} }
  }
  g[WINDOW_KEY] = { dispose: dispose, alive: true }
  if (ctx.effect) ctx.effect(function () { return dispose }, 'dsh-sidebar-toggle')
}

// ── Toggle groupBy (workspace <-> flat) ──

function toggleGroupBy(ctx) {
  var inst = resolveStore(ctx)
  if (!inst) return
  var snap = inst.getSnapshot()
  var cur = snap ? snap.groupBy : undefined
  var next = cur === 'workspace' ? 'flat' : 'workspace'
  if (inst.actions && inst.actions.setGroupBy) inst.actions.setGroupBy(next)
  console.log('[dsh-sidebar-toggle] groupBy: ' + cur + ' -> ' + next)
}

// ── Resolve workspace view store ──

function resolveStore(ctx) {
  try {
    var entries = ctx.slots.entries('sidebar.workspaces')
    if (!entries) return null
    for (var i = 0; i < entries.length; i++) {
      if (entries[i] && entries[i].store !== undefined) {
        return ctx.slots.resolveStore(entries[i].store, undefined)
      }
    }
  } catch (e) {}
  return null
}

module.exports = { inject: inject, apply: apply, name: name }

    return module.exports;
  }
});
