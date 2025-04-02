var DID_SDK = (function (exports) {
  'use strict';

  var me = Object.defineProperty;
  var ue = (e, t, a) => t in e ? me(e, t, { enumerable: true, configurable: true, writable: true, value: a }) : e[t] = a;
  var H = (e, t, a) => (ue(e, typeof t != "symbol" ? t + "" : t, a), a);
  class J extends Error {
    constructor({
      kind: a,
      description: n,
      error: s
    }) {
      super(JSON.stringify({
        kind: a,
        description: n
      }));
      H(this, "kind");
      H(this, "description");
      H(this, "error");
      this.kind = a, this.description = n, this.error = s;
    }
  }
  class fe extends J {
    constructor(t, a) {
      super({
        kind: "ChatCreationFailed",
        description: `Failed to create ${a ? "persistent" : ""} chat, mode: ${t}`
      });
    }
  }
  class ge extends J {
    constructor(t) {
      super({
        kind: "ChatModeDowngraded",
        description: `Chat mode downgraded to ${t}`
      });
    }
  }
  class B extends J {
    constructor(a, n) {
      super({
        kind: "ValidationError",
        description: a
      });
      H(this, "key");
      this.key = n;
    }
  }
  class he extends J {
    constructor(t) {
      super({
        kind: "WSError",
        description: t
      });
    }
  }
  var we = /* @__PURE__ */ ((e) => (e.TRIAL = "trial", e.BASIC = "basic", e.ENTERPRISE = "enterprise", e.LITE = "lite", e.ADVANCED = "advanced", e))(we || {}), pe = /* @__PURE__ */ ((e) => (e.TRIAL = "deid-trial", e.PRO = "deid-pro", e.ENTERPRISE = "deid-enterprise", e.LITE = "deid-lite", e.ADVANCED = "deid-advanced", e.BUILD = "deid-api-build", e.LAUNCH = "deid-api-launch", e.SCALE = "deid-api-scale", e))(pe || {}), ye = /* @__PURE__ */ ((e) => (e.Created = "created", e.Started = "started", e.Done = "done", e.Error = "error", e.Rejected = "rejected", e.Ready = "ready", e))(ye || {}), ve = /* @__PURE__ */ ((e) => (e.Unrated = "Unrated", e.Positive = "Positive", e.Negative = "Negative", e))(ve || {}), b = /* @__PURE__ */ ((e) => (e.Functional = "Functional", e.TextOnly = "TextOnly", e.Maintenance = "Maintenance", e.Playground = "Playground", e.DirectPlayback = "DirectPlayback", e))(b || {}), F = /* @__PURE__ */ ((e) => (e.Embed = "embed", e.Query = "query", e.Partial = "partial", e.Answer = "answer", e.Complete = "done", e))(F || {}), ke = /* @__PURE__ */ ((e) => (e.KnowledgeProcessing = "knowledge/processing", e.KnowledgeIndexing = "knowledge/indexing", e.KnowledgeFailed = "knowledge/error", e.KnowledgeDone = "knowledge/done", e))(ke || {}), Re = /* @__PURE__ */ ((e) => (e.Knowledge = "knowledge", e.Document = "document", e.Record = "record", e))(Re || {}), Ce = /* @__PURE__ */ ((e) => (e.Pdf = "pdf", e.Text = "text", e.Html = "html", e.Word = "word", e.Json = "json", e.Markdown = "markdown", e.Csv = "csv", e.Excel = "excel", e.Powerpoint = "powerpoint", e.Archive = "archive", e.Image = "image", e.Audio = "audio", e.Video = "video", e))(Ce || {}), ne = /* @__PURE__ */ ((e) => (e.Clip = "clip", e.Talk = "talk", e))(ne || {});
  const Se = (e) => {
    switch (e) {
      case "clip":
        return "clip";
      case "talk":
        return "talk";
      default:
        throw new Error(`Unknown video type: ${e}`);
    }
  };
  var D = /* @__PURE__ */ ((e) => (e.Start = "START", e.Stop = "STOP", e))(D || {}), U = /* @__PURE__ */ ((e) => (e.ChatAnswer = "chat/answer", e.ChatPartial = "chat/partial", e.StreamDone = "stream/done", e.StreamStarted = "stream/started", e.StreamFailed = "stream/error", e.StreamReady = "stream/ready", e.StreamCreated = "stream/created", e.StreamVideoCreated = "stream-video/started", e.StreamVideoDone = "stream-video/done", e.StreamVideoError = "stream-video/error", e.StreamVideoRejected = "stream-video/rejected", e))(U || {}), S = /* @__PURE__ */ ((e) => (e.New = "new", e.Fail = "fail", e.Connected = "connected", e.Connecting = "connecting", e.Closed = "closed", e.Completed = "completed", e.Disconnected = "disconnected", e))(S || {}), De = /* @__PURE__ */ ((e) => (e.Amazon = "amazon", e.Microsoft = "microsoft", e.Afflorithmics = "afflorithmics", e.Elevenlabs = "elevenlabs", e))(De || {}), _e = /* @__PURE__ */ ((e) => (e.Public = "public", e.Premium = "premium", e.Private = "private", e))(_e || {});
  const Me = 45 * 1e3, Ee = "X-Playground-Chat", K = "https://api.d-id.com", be = "wss://notifications.d-id.com", Ie = "79f81a83a67430be2bc0fd61042b8faa", ae = (e) => new Promise((t) => setTimeout(t, e)), q = () => Math.random().toString(16).slice(2);
  function Pe(e, t) {
    let a;
    return {
      promise: new Promise((s, i) => {
        a = setTimeout(() => i(new Error(t)), e);
      }),
      clear: () => clearTimeout(a)
    };
  }
  async function X(e, t) {
    const a = {
      limit: (t == null ? void 0 : t.limit) ?? 3,
      delayMs: (t == null ? void 0 : t.delayMs) ?? 0,
      timeout: (t == null ? void 0 : t.timeout) ?? 3e4,
      timeoutErrorMessage: (t == null ? void 0 : t.timeoutErrorMessage) || "Timeout error",
      shouldRetryFn: (t == null ? void 0 : t.shouldRetryFn) ?? (() => true),
      onRetry: (t == null ? void 0 : t.onRetry) ?? (() => {
      })
    };
    let n;
    for (let s = 1; s <= a.limit; s++)
      try {
        if (!a.timeout)
          return await e();
        const {
          promise: i,
          clear: r
        } = Pe(a.timeout, a.timeoutErrorMessage), o = e().finally(r);
        return await Promise.race([o, i]);
      } catch (i) {
        if (n = i, !a.shouldRetryFn(i) || s >= a.limit)
          throw i;
        await ae(a.delayMs), a.onRetry(i);
      }
    throw n;
  }
  function ie() {
    return "a5e9c674e2fe6"
  }
  let Te = q();
  function se(e) {
    if (e.type === "bearer")
      return `Bearer ${e.token}`;
    if (e.type === "basic")
      return `Basic ${btoa(`${e.username}:${e.password}`)}`;
    if (e.type === "key")
      return `Client-Key ${e.clientKey}.${ie()}_${Te}`;
    throw new Error(`Unknown auth type: ${e}`);
  }
  const $e = (e) => X(e, {
    limit: 3,
    delayMs: 1e3,
    timeout: 0,
    shouldRetryFn: (t) => t.status === 429
  });
  function Q(e, t = K, a) {
    const n = async (s, i) => {
      const {
        skipErrorHandler: r,
        ...o
      } = i || {}, c = await $e(() => fetch(t + (s != null && s.startsWith("/") ? s : `/${s}`), {
        ...o,
        headers: {
          ...o.headers,
          Authorization: se(e),
          "Content-Type": "application/json"
        }
      }));
      if (!c.ok) {
        let u = await c.text().catch(() => `Failed to fetch with status ${c.status}`);
        const d = new Error(u);
        throw a && !r && a(d, {
          url: s,
          options: o,
          headers: c.headers
        }), d;
      }
      return c.json();
    };
    return {
      get(s, i) {
        return n(s, {
          ...i,
          method: "GET"
        });
      },
      post(s, i, r) {
        return n(s, {
          ...r,
          body: JSON.stringify(i),
          method: "POST"
        });
      },
      delete(s, i, r) {
        return n(s, {
          ...r,
          body: JSON.stringify(i),
          method: "DELETE"
        });
      },
      patch(s, i, r) {
        return n(s, {
          ...r,
          body: JSON.stringify(i),
          method: "PATCH"
        });
      }
    };
  }
  function oe(e, t = K, a) {
    const n = Q(e, `${t}/agents`, a);
    return {
      create(s, i) {
        return n.post("/", s, i);
      },
      getAgents(s, i) {
        return n.get(`/${s ? `?tag=${s}` : ""}`, i).then((r) => r ?? []);
      },
      getById(s, i) {
        return n.get(`/${s}`, i);
      },
      delete(s, i) {
        return n.delete(`/${s}`, void 0, i);
      },
      update(s, i, r) {
        return n.patch(`/${s}`, i, r);
      },
      newChat(s, i, r) {
        return n.post(`/${s}/chat`, i, r);
      },
      chat(s, i, r, o) {
        return n.post(`/${s}/chat/${i}`, r, o);
      },
      createRating(s, i, r, o) {
        return n.post(`/${s}/chat/${i}/ratings`, r, o);
      },
      updateRating(s, i, r, o, c) {
        return n.patch(`/${s}/chat/${i}/ratings/${r}`, o, c);
      },
      deleteRating(s, i, r, o) {
        return n.delete(`/${s}/chat/${i}/ratings/${r}`, o);
      },
      getSTTToken(s, i) {
        return n.get(`/${s}/stt-token`, i);
      }
    };
  }
  const Z = (e) => e.type === "clip" && e.presenter_id.startsWith("v2_") ? "clip_v2" : e.type;
  function Ae(e) {
    var s, i, r, o;
    const t = () => /Mobi|Android/i.test(navigator.userAgent) ? "Mobile" : "Desktop", a = () => {
      const c = navigator.platform;
      return c.toLowerCase().includes("win") ? "Windows" : c.toLowerCase().includes("mac") ? "Mac OS X" : c.toLowerCase().includes("linux") ? "Linux" : "Unknown";
    }, n = e.presenter;
    return {
      $os: `${a()}`,
      isMobile: `${t() == "Mobile"}`,
      browser: navigator.userAgent,
      origin: window.location.origin,
      agentType: Z(n),
      agentVoice: {
        voiceId: (i = (s = e.presenter) == null ? void 0 : s.voice) == null ? void 0 : i.voice_id,
        provider: (o = (r = e.presenter) == null ? void 0 : r.voice) == null ? void 0 : o.type
      }
    };
  }
  function ze(e, t, a) {
    var c, u, d;
    const {
      event: n,
      ...s
    } = e, {
      template: i
    } = (t == null ? void 0 : t.llm) || {}, {
      language: r
    } = ((c = t == null ? void 0 : t.presenter) == null ? void 0 : c.voice) || {};
    return {
      ...s,
      llm: {
        ...s.llm,
        template: i
      },
      script: {
        ...s.script,
        provider: {
          ...(u = s == null ? void 0 : s.script) == null ? void 0 : u.provider,
          language: r
        }
      },
      stitch: (t == null ? void 0 : t.presenter.type) === "talk" ? (d = t == null ? void 0 : t.presenter) == null ? void 0 : d.stitch : void 0,
      ...a
    };
  }
  let V = {};
  const Le = "https://api-js.mixpanel.com/track/?verbose=1&ip=1";
  function je(e) {
    var i, r, o, c, u, d;
    const t = window != null && window.hasOwnProperty("DID_AGENTS_API") ? "agents-ui" : "agents-sdk", a = e.agent.presenter, n = (i = e.agent.llm) == null ? void 0 : i.prompt_customization, s = {
      token: e.token || "testKey",
      distinct_id: e.distinctId || ie(),
      agentId: e.agent.id,
      agentType: Z(a),
      owner_id: e.agent.owner_id ?? "",
      promptVersion: (r = e.agent.llm) == null ? void 0 : r.prompt_version,
      behavior: {
        role: n == null ? void 0 : n.role,
        personality: n == null ? void 0 : n.personality,
        instructions: (o = e.agent.llm) == null ? void 0 : o.instructions
      },
      temperature: (c = e.agent.llm) == null ? void 0 : c.temperature,
      knowledgeSource: n == null ? void 0 : n.knowledge_source,
      starterQuestionsCount: (d = (u = e.agent.knowledge) == null ? void 0 : u.starter_message) == null ? void 0 : d.length,
      topicsToAvoid: n == null ? void 0 : n.topics_to_avoid,
      maxResponseLength: n == null ? void 0 : n.max_response_length
    };
    return {
      ...s,
      additionalProperties: {},
      isEnabled: e.isEnabled ?? true,
      getRandom: () => Math.random().toString(16).slice(2),
      enrich(g) {
        const R = {};
        if (g && typeof g != "object")
          throw new Error("properties must be a flat json object");
        for (let h in g)
          (typeof g[h] == "string" || typeof g[h] == "number") && (R[h] = g[h]);
        this.additionalProperties = {
          ...this.additionalProperties,
          ...R
        };
      },
      async track(g, R) {
        if (!this.isEnabled)
          return Promise.resolve();
        const {
          audioPath: h,
          ...y
        } = R || {}, v = {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          },
          body: new URLSearchParams({
            data: JSON.stringify([{
              event: g,
              properties: {
                ...this.additionalProperties,
                ...y,
                ...s,
                source: t,
                time: Date.now(),
                $insert_id: this.getRandom(),
                origin: window.location.href,
                "Screen Height": window.screen.height || window.innerWidth,
                "Screen Width": window.screen.width || window.innerHeight,
                "User Agent": navigator.userAgent
              }
            }])
          })
        };
        try {
          return await fetch(Le, v).then((C) => C.json());
        } catch (C) {
          return console.error(C);
        }
      },
      linkTrack(g, R, h, y) {
        V[g] || (V[g] = {
          events: {},
          resolvedDependencies: []
        }), y.includes(h) || y.push(h);
        const v = V[g];
        if (v.events[h] = {
          props: R
        }, v.resolvedDependencies.push(h), y.every((A) => v.resolvedDependencies.includes(A))) {
          const A = y.reduce((I, l) => v.events[l] ? {
            ...I,
            ...v.events[l].props
          } : I, {});
          this.track(g, A), v.resolvedDependencies = v.resolvedDependencies.filter((I) => !y.includes(I)), y.forEach((I) => {
            delete v.events[I];
          });
        }
      }
    };
  }
  function xe() {
    let e = 0;
    return {
      reset: () => e = 0,
      update: () => e = Date.now(),
      get: (t = false) => t ? Date.now() - e : e
    };
  }
  const N = xe();
  function ce(e) {
    return e === b.Playground ? {
      headers: {
        [Ee]: "true"
      }
    } : {};
  }
  async function de(e, t, a, n, s = false, i) {
    try {
      return !i && n !== b.DirectPlayback && (i = await t.newChat(e.id, {
        persist: s
      }, ce(n)), a.track("agent-chat", {
        event: "created",
        chat_id: i.id,
        agent_id: e.id,
        mode: n
      })), {
        chat: i,
        chatMode: (i == null ? void 0 : i.chat_mode) ?? n
      };
    } catch (r) {
      try {
        const o = JSON.parse(r.message);
        if ((o == null ? void 0 : o.kind) === "InsufficientCreditsError")
          throw new Error("InsufficientCreditsError");
      } catch (o) {
        console.error("Error parsing the error message:", o);
      }
      throw new Error("Cannot create new chat");
    }
  }
  function Ne(e) {
    var a;
    const t = ((a = e.greetings) == null ? void 0 : a.filter((n) => n.length > 0)) ?? [];
    return t.length > 0 ? t[Math.floor(Math.random() * t.length)] : `Hi! I'm ${e.preview_name || "My Agent"}. How can I help you?`;
  }
  function ee(e, t) {
    return t && t.length > 0 ? t : [{
      content: e,
      id: q(),
      role: "assistant",
      created_at: (/* @__PURE__ */ new Date()).toISOString()
    }];
  }
  function Be(e) {
    return new Promise((t, a) => {
      const {
        callbacks: n,
        host: s,
        auth: i
      } = e, {
        onMessage: r = null,
        onOpen: o = null,
        onClose: c = null,
        onError: u = null
      } = n || {}, d = new WebSocket(`${s}?authorization=${se(i)}`);
      d.onmessage = r, d.onclose = c, d.onerror = (g) => {
        console.error(g), u == null || u("Websocket failed to connect", g), a(g);
      }, d.onopen = (g) => {
        o == null || o(g), t(d);
      };
    });
  }
  async function Fe(e) {
    const {
      retries: t = 1
    } = e;
    let a = null;
    for (let n = 0; (a == null ? void 0 : a.readyState) !== WebSocket.OPEN; n++)
      try {
        a = await Be(e);
      } catch (s) {
        if (n === t)
          throw s;
        await ae(n * 500);
      }
    return a;
  }
  async function We(e, t, a) {
    const n = a != null && a.onMessage ? [a.onMessage] : [], s = await Fe({
      auth: e,
      host: t,
      callbacks: {
        onError: (i) => {
          var r;
          return (r = a.onError) == null ? void 0 : r.call(a, new he(i));
        },
        onMessage(i) {
          const r = JSON.parse(i.data);
          n.forEach((o) => o(r.event, r));
        }
      }
    });
    return {
      socket: s,
      disconnect: () => s.close(),
      subscribeToEvents: (i) => n.push(i)
    };
  }
  function He(e) {
    if (e.answer !== void 0)
      return e.answer;
    let t = 0, a = "";
    for (; t in e; )
      a += e[t++];
    return a;
  }
  function Ke(e, t, a, n, s) {
    const i = n.messages[n.messages.length - 1];
    if (!(e === F.Partial || e === F.Answer) || (i == null ? void 0 : i.role) !== "assistant")
      return;
    const {
      content: r,
      sequence: o
    } = t;
    e === F.Partial ? a[o] = r : a.answer = r;
    const c = He(a);
    (i.content !== c || e === F.Answer) && (i.content = c, s == null || s([...n.messages], e));
  }
  function Ue(e, t, a, n, s) {
    let i = {};
    return {
      clearQueue: () => i = {},
      onMessage: (r, o) => {
        var c, u;
        if ("content" in o)
          Ke(r, o, i, t, a.callbacks.onNewMessage), r === F.Answer && e.track("agent-message-received", {
            messages: t.messages.length,
            mode: t.chatMode
          });
        else {
          const d = U, g = [d.StreamVideoDone, d.StreamVideoError, d.StreamVideoRejected], R = [d.StreamFailed, d.StreamVideoError, d.StreamVideoRejected], h = ze(o, n, {
            mode: t.chatMode
          });
          if (r = r, r === d.StreamVideoCreated)
            e.linkTrack("agent-video", h, d.StreamVideoCreated, ["start"]);
          else if (g.includes(r)) {
            const y = r.split("/")[1];
            R.includes(r) ? e.track("agent-video", {
              ...h,
              event: y
            }) : e.linkTrack("agent-video", {
              ...h,
              event: y
            }, r, ["done"]);
          }
          R.includes(r) && ((u = (c = a.callbacks).onError) == null || u.call(c, new Error(`Stream failed with event ${r}`), {
            data: o
          })), o.event === d.StreamDone && s();
        }
      }
    };
  }
  function qe(e, t, a, n) {
    const s = Q(e, `${t}/agents/${a}`, n);
    return {
      createStream(i) {
        return s.post("/streams", {
          output_resolution: i.output_resolution,
          compatibility_mode: i.compatibility_mode,
          stream_warmup: i.stream_warmup,
          session_timeout: i.session_timeout,
          stream_greeting: i.stream_greeting
        });
      },
      startConnection(i, r, o) {
        return s.post(`/streams/${i}/sdp`, {
          session_id: o,
          answer: r
        });
      },
      addIceCandidate(i, r, o) {
        return s.post(`/streams/${i}/ice`, {
          session_id: o,
          ...r
        });
      },
      sendStreamRequest(i, r, o) {
        return s.post(`/streams/${i}`, {
          session_id: r,
          ...o
        });
      },
      close(i, r) {
        return s.delete(`/streams/${i}`, {
          session_id: r
        });
      }
    };
  }
  function Je(e, t, a, n) {
    const s = Q(e, `${t}/agents/${a}`, n);
    return {
      createStream(i, r) {
        return s.post("/streams", {
          driver_url: i.driver_url,
          face: i.face,
          config: i.config,
          output_resolution: i.output_resolution,
          compatibility_mode: i.compatibility_mode,
          stream_warmup: i.stream_warmup,
          session_timeout: i.session_timeout,
          stream_greeting: i.stream_greeting
        }, r);
      },
      startConnection(i, r, o, c) {
        return s.post(`/streams/${i}/sdp`, {
          session_id: o,
          answer: r
        }, c);
      },
      addIceCandidate(i, r, o, c) {
        return s.post(`/streams/${i}/ice`, {
          session_id: o,
          ...r
        }, c);
      },
      sendStreamRequest(i, r, o, c) {
        return s.post(`/streams/${i}`, {
          session_id: r,
          ...o
        }, c);
      },
      close(i, r, o) {
        return s.delete(`/streams/${i}`, {
          session_id: r
        }, o);
      }
    };
  }
  function Ve(e, t, a) {
    const n = (t.timestamp - e.timestamp) / 1e3;
    return {
      duration: n,
      bytesReceived: t.bytesReceived - e.bytesReceived,
      bitrate: Math.round((t.bytesReceived - e.bytesReceived) * 8 / n),
      packetsReceived: t.packetsReceived - e.packetsReceived,
      packetsLost: t.packetsLost - e.packetsLost,
      framesDropped: t.framesDropped - e.framesDropped,
      framesDecoded: t.framesDecoded - e.framesDecoded,
      jitter: t.jitter,
      jitterBufferDelay: (t.jitterBufferDelay - e.jitterBufferDelay) / n,
      framesPerSecond: t.framesPerSecond,
      freezeCount: t.freezeCount - e.freezeCount,
      freezeDuration: t.freezeDuration - e.freezeDuration,
      lowFpsCount: a
    };
  }
  function Xe(e) {
    return e.filter((t) => t.freezeCount > 0 || t.framesPerSecond < 21 || t.framesDropped > 0 || t.packetsLost > 0).map((t) => {
      const {
        timestamp: a,
        ...n
      } = t, s = [];
      return t.freezeCount > 0 && s.push("freeze"), t.framesPerSecond < 21 && s.push("low fps"), t.framesDropped > 0 && s.push("frames dropped"), t.packetsLost > 0 && s.push("packet loss"), {
        ...n,
        causes: s
      };
    });
  }
  function Ye(e) {
    let t = "";
    for (const a of e.values())
      if (a && a.type === "codec" && a.mimeType.startsWith("video") && (t = a.mimeType.split("/")[1]), a && a.type === "inbound-rtp" && a.kind === "video")
        return {
          codec: t,
          timestamp: a.timestamp,
          bytesReceived: a.bytesReceived,
          packetsReceived: a.packetsReceived,
          packetsLost: a.packetsLost,
          framesDropped: a.framesDropped,
          framesDecoded: a.framesDecoded,
          jitter: a.jitter,
          jitterBufferDelay: a.jitterBufferDelay,
          frameWidth: a.frameWidth,
          frameHeight: a.frameHeight,
          framesPerSecond: a.framesPerSecond,
          freezeCount: a.freezeCount,
          freezeDuration: a.totalFreezesDuration
        };
    return {};
  }
  function Qe(e, t, a) {
    const n = e.map((r, o) => o === 0 ? a ? {
      timestamp: r.timestamp,
      duration: 0,
      bytesReceived: r.bytesReceived - a.bytesReceived,
      bitrate: (r.bytesReceived - a.bytesReceived) * 8 / (t / 1e3),
      packetsReceived: r.packetsReceived - a.packetsReceived,
      packetsLost: r.packetsLost - a.packetsLost,
      framesDropped: r.framesDropped - a.framesDropped,
      framesDecoded: r.framesDecoded - a.framesDecoded,
      jitter: r.jitter,
      jitterBufferDelay: r.jitterBufferDelay - a.jitterBufferDelay,
      framesPerSecond: r.framesPerSecond,
      freezeCount: r.freezeCount - a.freezeCount,
      freezeDuration: r.freezeDuration - a.freezeDuration
    } : {
      timestamp: r.timestamp,
      duration: 0,
      bytesReceived: r.bytesReceived,
      bitrate: r.bytesReceived * 8 / (t / 1e3),
      packetsReceived: r.packetsReceived,
      packetsLost: r.packetsLost,
      framesDropped: r.framesDropped,
      framesDecoded: r.framesDecoded,
      jitter: r.jitter,
      jitterBufferDelay: r.jitterBufferDelay,
      framesPerSecond: r.framesPerSecond,
      freezeCount: r.freezeCount,
      freezeDuration: r.freezeDuration
    } : {
      timestamp: r.timestamp,
      duration: t * o / 1e3,
      bytesReceived: r.bytesReceived - e[o - 1].bytesReceived,
      bitrate: (r.bytesReceived - e[o - 1].bytesReceived) * 8 / (t / 1e3),
      packetsReceived: r.packetsReceived - e[o - 1].packetsReceived,
      packetsLost: r.packetsLost - e[o - 1].packetsLost,
      framesDropped: r.framesDropped - e[o - 1].framesDropped,
      framesDecoded: r.framesDecoded - e[o - 1].framesDecoded,
      jitter: r.jitter,
      jitterBufferDelay: r.jitterBufferDelay - e[o - 1].jitterBufferDelay,
      framesPerSecond: r.framesPerSecond,
      freezeCount: r.freezeCount - e[o - 1].freezeCount,
      freezeDuration: r.freezeDuration - e[o - 1].freezeDuration
    }), s = Xe(n), i = s.reduce((r, o) => r + (o.causes.includes("low fps") ? 1 : 0), 0);
    return {
      webRTCStats: {
        anomalies: s,
        aggregateReport: Ve(e[0], e[e.length - 1], i)
      },
      codec: e[0].codec,
      resolution: `${e[0].frameWidth}x${e[0].frameHeight}`
    };
  }
  const Y = 200, Ze = Math.max(Math.ceil(400 / Y), 1);
  function Ge() {
    let e = 0;
    return (t) => {
      for (const a of t.values())
        if (a && a.type === "inbound-rtp" && a.kind === "video") {
          const n = a.bytesReceived, s = n - e > 0;
          return e = n, s;
        }
      return false;
    };
  }
  function Oe(e, t, a, n, s = false, i = false) {
    const r = s ? 1 : 0;
    let o = [], c, u = 0, d = false, g = 0;
    const R = Ge();
    return setInterval(async () => {
      const h = await e.getStats(), y = R(h), v = Ye(h);
      if (y)
        u = 0, d || (n == null || n(D.Start), i && g >= r && !t() && a(), c = o[o.length - 1], o = [], g++, d = true), o.push(v);
      else if (d && (u++, u >= Ze)) {
        const C = Qe(o, Y, c);
        n == null || n(D.Stop, C), !i && !t() && a(), d = false;
      }
    }, Y);
  }
  let le = false;
  const L = (e, t) => le && console.log(e, t), et = (window.RTCPeerConnection || window.webkitRTCPeerConnection || window.mozRTCPeerConnection).bind(window);
  function te(e) {
    switch (e) {
      case "connected":
        return S.Connected;
      case "checking":
        return S.Connecting;
      case "failed":
        return S.Fail;
      case "new":
        return S.New;
      case "closed":
        return S.Closed;
      case "disconnected":
        return S.Disconnected;
      case "completed":
        return S.Completed;
      default:
        return S.New;
    }
  }
  function re(e, t, a, n) {
    e === D.Start && t === D.Start ? a == null || a(D.Start) : e === D.Stop && t === D.Stop && (a == null || a(D.Stop, n));
  }
  async function tt(e, t, {
    debug: a = false,
    callbacks: n,
    auth: s,
    baseURL: i = K,
    warmup: r
  }) {
    le = a;
    let o = false, c = false, u = D.Stop, d = D.Stop;
    const {
      startConnection: g,
      sendStreamRequest: R,
      close: h,
      createStream: y,
      addIceCandidate: v
    } = t.videoType === ne.Clip ? qe(s, i, e, n.onError) : Je(s, i, e, n.onError), {
      id: C,
      offer: A,
      ice_servers: I,
      session_id: l
    } = await y(t), m = new et({
      iceServers: I
    }), k = m.createDataChannel("JanusDataChannel");
    if (!l)
      throw new Error("Could not create session_id");
    const P = () => o, T = () => {
      var f;
      o = true, c && ((f = n.onConnectionStateChange) == null || f.call(n, S.Connected));
    }, _ = Oe(m, P, T, (f, w) => re(d = f, u, n.onVideoStateChange, w), r, !!t.stream_greeting);
    m.onicecandidate = (f) => {
      var w;
      L("peerConnection.onicecandidate", f);
      try {
        f.candidate && f.candidate.sdpMid && f.candidate.sdpMLineIndex !== null ? v(C, {
          candidate: f.candidate.candidate,
          sdpMid: f.candidate.sdpMid,
          sdpMLineIndex: f.candidate.sdpMLineIndex
        }, l) : v(C, {
          candidate: null
        }, l);
      } catch (p) {
        (w = n.onError) == null || w.call(n, p, {
          streamId: C
        });
      }
    }, k.onopen = () => {
      c = true, (!t.stream_warmup && !t.stream_greeting || o) && T();
    }, k.onmessage = (f) => {
      f.data === "stream/started" ? u = D.Start : f.data === "stream/done" && (u = D.Stop), re(d, u, n.onVideoStateChange);
    }, m.oniceconnectionstatechange = () => {
      var w;
      L("peerConnection.oniceconnectionstatechange => " + m.iceConnectionState);
      const f = te(m.iceConnectionState);
      f !== S.Connected && ((w = n.onConnectionStateChange) == null || w.call(n, f));
    }, m.ontrack = (f) => {
      var w;
      L("peerConnection.ontrack", f), (w = n.onSrcObjectReady) == null || w.call(n, f.streams[0]);
    }, await m.setRemoteDescription(A), L("set remote description OK");
    const $ = await m.createAnswer();
    return L("create answer OK"), await m.setLocalDescription($), L("set local description OK"), await g(C, $, l), L("start connection OK"), {
      /**
       * Method to send request to server to get clip or talk depend on you payload
       * @param payload
       */
      speak(f) {
        return R(C, l, f);
      },
      /**
       * Method to close RTC connection
       */
      async disconnect() {
        var f, w;
        if (C) {
          const p = te(m.iceConnectionState);
          if (m) {
            if (p === S.New) {
              (f = n.onVideoStateChange) == null || f.call(n, D.Stop), clearInterval(_);
              return;
            }
            m.close(), m.oniceconnectionstatechange = null, m.onnegotiationneeded = null, m.onicecandidate = null, m.ontrack = null;
          }
          try {
            p === S.Connected && await h(C, l).catch((M) => {
            });
          } catch (M) {
            L("Error on close stream connection", M);
          }
          (w = n.onVideoStateChange) == null || w.call(n, D.Stop), clearInterval(_);
        }
      },
      /**
       * Session identifier information, should be returned in the body of all streaming requests
       */
      sessionId: l,
      /**
       * Id of current RTC stream
       */
      streamId: C
    };
  }
  function rt(e, t, a) {
    var s;
    const {
      streamOptions: n
    } = t ?? {};
    return {
      videoType: Se(e.presenter.type),
      output_resolution: n == null ? void 0 : n.outputResolution,
      session_timeout: n == null ? void 0 : n.sessionTimeout,
      stream_warmup: n == null ? void 0 : n.streamWarmup,
      compatibility_mode: n == null ? void 0 : n.compatibilityMode,
      stream_greeting: Z(e.presenter) !== "clip" && ((s = t == null ? void 0 : t.streamOptions) != null && s.streamGreeting) ? a : void 0
    };
  }
  function nt(e, t, a, n) {
    N.get() > 0 && (e === D.Start ? n.linkTrack("agent-video", {
      event: "start",
      latency: N.get(true)
    }, "start", [U.StreamVideoCreated]) : e === D.Stop && n.linkTrack("agent-video", {
      event: "stop",
      is_greenscreen: t.presenter.type === "clip" && t.presenter.is_greenscreen,
      background: t.presenter.type === "clip" && t.presenter.background,
      ...a
    }, "done", [U.StreamVideoDone]));
  }
  function at(e, t, a, n) {
    return N.reset(), new Promise(async (s, i) => {
      var r;
      try {
        const o = await tt(e.id, rt(e, t, n), {
          ...t,
          analytics: a,
          warmup: (r = t.streamOptions) == null ? void 0 : r.streamWarmup,
          callbacks: {
            ...t.callbacks,
            onConnectionStateChange: (c) => {
              var u, d;
              (d = (u = t.callbacks).onConnectionStateChange) == null || d.call(u, c), c === S.Connected && s(o);
            },
            onVideoStateChange: (c, u) => {
              var d, g;
              (g = (d = t.callbacks).onVideoStateChange) == null || g.call(d, c), nt(c, e, u, a);
            }
          }
        });
      } catch (o) {
        i(o);
      }
    });
  }
  async function it(e, t, a, n, s, i) {
    var u, d, g, R;
    const {
      chat: r,
      chatMode: o
    } = await de(e, a, n, t.mode, t.persistentChat, s);
    if (o && o !== t.mode && (t.mode = o, (d = (u = t.callbacks).onModeChange) == null || d.call(u, o), o === b.TextOnly))
      return (R = (g = t.callbacks).onError) == null || R.call(g, new ge(o)), {
        chat: r
      };
    const c = await at(e, t, n, i);
    return {
      chat: r,
      streamingManager: c
    };
  }
  async function ot(e, t) {
    var C, A, I;
    let a = true;
    const n = t.mixpanelKey || Ie, s = t.wsURL || be, i = t.baseURL || K, r = {
      messages: [],
      chatMode: t.mode || b.Functional
    }, o = oe(t.auth, i, t.callbacks.onError), c = await o.getById(e), u = Ne(c), d = je({
      token: n,
      agent: c,
      isEnabled: t.enableAnalitics,
      distinctId: t.distinctId
    }), {
      onMessage: g,
      clearQueue: R
    } = Ue(d, r, t, c, () => {
      var l;
      return (l = r.socketManager) == null ? void 0 : l.disconnect();
    });
    r.messages = ee(u, t.initialMessages), (A = (C = t.callbacks).onNewMessage) == null || A.call(C, [...r.messages], "answer"), d.track("agent-sdk", {
      event: "loaded",
      ...Ae(c)
    });
    async function h(l) {
      var $, f, w, p, M, E, j;
      (f = ($ = t.callbacks).onConnectionStateChange) == null || f.call($, S.Connecting), N.reset(), l && !a && (delete r.chat, r.messages = ee(u), (p = (w = t.callbacks).onNewMessage) == null || p.call(w, [...r.messages], "answer"));
      const m = t.mode === b.DirectPlayback ? Promise.resolve(void 0) : We(t.auth, s, {
        onMessage: g,
        onError: t.callbacks.onError
      }), k = X(() => it(c, t, o, d, r.chat, l ? u : void 0), {
        limit: 3,
        timeout: Me,
        timeoutErrorMessage: "Timeout initializing the stream",
        // Retry on all errors except for connection errors and rate limit errors, these are already handled in client level.
        shouldRetryFn: (z) => (z == null ? void 0 : z.message) !== "Could not connect" && z.status !== 429,
        delayMs: 1e3
      }).catch((z) => {
        var x, W;
        throw v(b.Maintenance), (W = (x = t.callbacks).onConnectionStateChange) == null || W.call(x, S.Fail), z;
      }), [P, {
        streamingManager: T,
        chat: _
      }] = await Promise.all([m, k]);
      _ && _.id !== ((M = r.chat) == null ? void 0 : M.id) && ((j = (E = t.callbacks).onNewChat) == null || j.call(E, _.id)), r.streamingManager = T, r.socketManager = P, r.chat = _, a = false, v((_ == null ? void 0 : _.chat_mode) ?? t.mode ?? b.Functional);
    }
    async function y() {
      var l, m, k, P;
      (l = r.socketManager) == null || l.disconnect(), await ((m = r.streamingManager) == null ? void 0 : m.disconnect()), delete r.streamingManager, delete r.socketManager, (P = (k = t.callbacks).onConnectionStateChange) == null || P.call(k, S.Disconnected);
    }
    async function v(l) {
      var m, k;
      l !== r.chatMode && (d.track("agent-mode-change", {
        mode: l
      }), r.chatMode = l, r.chatMode !== b.Functional && await y(), (k = (m = t.callbacks).onModeChange) == null || k.call(m, l));
    }
    return {
      agent: c,
      starterMessages: ((I = c.knowledge) == null ? void 0 : I.starter_message) || [],
      getSTTToken: () => o.getSTTToken(c.id),
      changeMode: v,
      enrichAnalytics: d.enrich,
      async connect() {
        var l;
        await h(true), d.track("agent-chat", {
          event: "connect",
          chatId: (l = r.chat) == null ? void 0 : l.id,
          agentId: c.id,
          mode: r.chatMode
        });
      },
      async reconnect() {
        var l;
        await y(), await h(false), d.track("agent-chat", {
          event: "reconnect",
          chatId: (l = r.chat) == null ? void 0 : l.id,
          agentId: c.id,
          mode: r.chatMode
        });
      },
      async disconnect() {
        var l;
        await y(), d.track("agent-chat", {
          event: "disconnect",
          chatId: (l = r.chat) == null ? void 0 : l.id,
          agentId: c.id,
          mode: r.chatMode
        });
      },
      async chat(l) {
        var T, _, $, f, w;
        const m = () => {
          if (t.mode === b.DirectPlayback)
            throw new B("Direct playback is enabled, chat is disabled");
          if (l.length >= 800)
            throw new B("Message cannot be more than 800 characters");
          if (l.length === 0)
            throw new B("Message cannot be empty");
          if (r.chatMode === b.Maintenance)
            throw new B("Chat is in maintenance mode");
          if (![b.TextOnly, b.Playground].includes(r.chatMode)) {
            if (!r.streamingManager)
              throw new B("Streaming manager is not initialized");
            if (!r.chat)
              throw new B("Chat is not initialized");
          }
        }, k = async () => {
          var p, M;
          if (!r.chat) {
            const E = await de(c, o, d, r.chatMode, t.persistentChat);
            if (!E.chat)
              throw new fe(r.chatMode, !!t.persistentChat);
            r.chat = E.chat, (M = (p = t.callbacks).onNewChat) == null || M.call(p, r.chat.id);
          }
          return r.chat.id;
        }, P = async (p, M) => X(() => {
          var E, j;
          return o.chat(c.id, M, {
            chatMode: r.chatMode,
            streamId: (E = r.streamingManager) == null ? void 0 : E.streamId,
            sessionId: (j = r.streamingManager) == null ? void 0 : j.sessionId,
            messages: p.map(({
              matches: z,
              ...x
            }) => x)
          }, {
            ...ce(r.chatMode),
            skipErrorHandler: !0
          });
        }, {
          limit: 2,
          shouldRetryFn: (E) => {
            var x, W, G, O;
            const j = (x = E == null ? void 0 : E.message) == null ? void 0 : x.includes("missing or invalid session_id");
            return !((W = E == null ? void 0 : E.message) == null ? void 0 : W.includes("Stream Error")) && !j ? ((O = (G = t.callbacks).onError) == null || O.call(G, E), false) : true;
          },
          onRetry: async () => {
            await y(), await h(false);
          }
        });
        try {
          R(), m(), r.messages.push({
            id: q(),
            role: "user",
            content: l,
            created_at: new Date(N.update()).toISOString()
          }), (_ = (T = t.callbacks).onNewMessage) == null || _.call(T, [...r.messages], "user");
          const p = await k(), M = await P([...r.messages], p);
          return r.messages.push({
            id: q(),
            role: "assistant",
            content: M.result || "",
            created_at: (/* @__PURE__ */ new Date()).toISOString(),
            context: M.context,
            matches: M.matches
          }), d.track("agent-message-send", {
            event: "success",
            mode: r.chatMode,
            messages: r.messages.length + 1
          }), M.result && ((f = ($ = t.callbacks).onNewMessage) == null || f.call($, [...r.messages], "answer"), d.track("agent-message-received", {
            latency: N.get(!0),
            mode: r.chatMode,
            messages: r.messages.length
          })), M;
        } catch (p) {
          throw ((w = r.messages[r.messages.length - 1]) == null ? void 0 : w.role) === "assistant" && r.messages.pop(), d.track("agent-message-send", {
            event: "error",
            mode: r.chatMode,
            messages: r.messages.length
          }), p;
        }
      },
      rate(l, m, k) {
        var _, $, f, w;
        const P = r.messages.find((p) => p.id === l);
        if (r.chat) {
          if (!P)
            throw new Error("Message not found");
        } else
          throw new Error("Chat is not initialized");
        const T = ((_ = P.matches) == null ? void 0 : _.map((p) => [p.document_id, p.id])) ?? [];
        return d.track("agent-rate", {
          event: k ? "update" : "create",
          thumb: m === 1 ? "up" : "down",
          knowledge_id: (($ = c.knowledge) == null ? void 0 : $.id) ?? "",
          mode: r.chatMode,
          matches: T,
          score: m
        }), k ? o.updateRating(c.id, r.chat.id, k, {
          knowledge_id: ((f = c.knowledge) == null ? void 0 : f.id) ?? "",
          message_id: l,
          matches: T,
          score: m
        }) : o.createRating(c.id, r.chat.id, {
          knowledge_id: ((w = c.knowledge) == null ? void 0 : w.id) ?? "",
          message_id: l,
          matches: T,
          score: m
        });
      },
      deleteRate(l) {
        var m;
        if (!r.chat)
          throw new Error("Chat is not initialized");
        return d.track("agent-rate-delete", {
          type: "text",
          chat_id: (m = r.chat) == null ? void 0 : m.id,
          id: l,
          mode: r.chatMode
        }), o.deleteRating(c.id, r.chat.id, l);
      },
      speak(l) {
        if (!r.streamingManager)
          throw new Error("Please connect to the agent first");
        function m() {
          if (typeof l == "string") {
            if (!c.presenter.voice)
              throw new Error("Presenter voice is not initialized");
            return {
              type: "text",
              provider: c.presenter.voice,
              input: l,
              ssml: false
            };
          }
          if (l.type === "text" && !l.provider) {
            if (!c.presenter.voice)
              throw new Error("Presenter voice is not initialized");
            return {
              type: "text",
              provider: c.presenter.voice,
              input: l.input,
              ssml: l.ssml
            };
          }
          return l;
        }
        const k = m();
        return d.track("agent-speak", k), N.update(), r.streamingManager.speak({
          script: k
        });
      }
    };
  }
  function ct(e, t, a) {
    const {
      getById: n
    } = oe(t, a || K);
    return n(e);
  }

  exports.AgentStatus = ye;
  exports.ChatCreationFailed = fe;
  exports.ChatMode = b;
  exports.ChatModeDowngraded = ge;
  exports.ChatProgress = F;
  exports.ConnectionState = S;
  exports.DocumentType = Ce;
  exports.KnowledgeType = Re;
  exports.PlanGroup = pe;
  exports.Providers = De;
  exports.RateState = ve;
  exports.StreamEvents = U;
  exports.StreamingState = D;
  exports.Subject = ke;
  exports.UserPlan = we;
  exports.ValidationError = B;
  exports.VideoType = ne;
  exports.VoiceAccess = _e;
  exports.WsError = he;
  exports.createAgentManager = ot;
  exports.getAgent = ct;
  exports.mapVideoType = Se;

  return exports;

})({});
