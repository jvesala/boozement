// Copyright (c) Microsoft Corporation.  All rights reserved.
// This code is licensed by Microsoft Corporation under the terms
// of the MICROSOFT REACTIVE EXTENSIONS FOR JAVASCRIPT AND .NET LIBRARIES License.
// See http://go.microsoft.com/fwlink/?LinkId=186234.

(function() {
    var a = this;
    var b;
    if (typeof ProvideCustomRxRootObject == "undefined")b = a.Rx; else b = ProvideCustomRxRootObject();
    var c = undefined;
    var d = function(m, n) {
        return m === n;
    };
    var e = function(m) {
        return m;
    };
    var f = b.Observable;
    var g = f.prototype;
    var h = "Sequence contains no elements.";
    var i = f.CreateWithDisposable;
    var j = Rx.Scheduler.CurrentThread;
    var k = function(m) {
        if (m.length == 0)throw h;
        return m[0];
    };
    g.Aggregate = function(m, n) {
        return this.Scan0(m, n).Final();
    };
    g.Aggregate1 = function(m) {
        return this.Scan1(m).Final();
    };
    g.IsEmpty = function() {
        var m = this;
        return i(function(n) {
            return m.Subscribe(function() {
                n.OnNext(false);
                n.OnCompleted();
            }, function(o) {
                n.OnError(o);
            }, function() {
                n.OnNext(true);
                n.OnCompleted();
            });
        });
    };
    g.Any = function(m) {
        if (m === c)return this.IsEmpty().Select(function(n) {
            return !n;
        });
        return this.Where(m).Any();
    };
    g.All = function(m) {
        if (m === c)m = e;
        return this.Where(
                         function(n) {
                             return !m(n);
                         }).IsEmpty();
    };
    g.Contains = function(m, n) {
        if (n === c)n = d;
        return this.Where(
                         function(o) {
                             return n(o, m);
                         }).Any();
    };
    g.Count = function() {
        return this.Aggregate(0, function(m, n) {
            return m + 1;
        });
    };
    g.Sum = function() {
        return this.Aggregate(0, function(m, n) {
            return m + n;
        });
    };
    g.Average = function() {
        return this.Scan({sum:0,count:0},
                        function(m, n) {
                            return {sum:m.sum + n,count:m.count + 1};
                        }).Final().Select(function(m) {
            return m.sum / m.count;
        });
    };
    g.Final = function() {
        var m = this;
        return i(function(n) {
            var o;
            var p = false;
            return m.Subscribe(function(q) {
                p = true;
                o = q;
            }, function(q) {
                n.OnError(q);
            }, function() {
                if (!p)n.OnError(h);
                n.OnNext(o);
                n.OnCompleted();
            });
        });
    };
    var l = function(m, n, o) {
        return i(function(p) {
            var q = false;
            var r;
            var s = [];
            return m.Subscribe(function(t) {
                var u;
                try {
                    u = n(t);
                } catch(w) {
                    p.OnError(w);
                    return;
                }
                var v = 0;
                if (!q) {
                    q = true;
                    r = u;
                } else try {
                    v = o(u, r);
                } catch(w) {
                    p.OnError(w);
                    return;
                }
                if (v > 0) {
                    r = u;
                    s = [];
                }
                if (v >= 0)s.push(t);
            }, function(t) {
                p.OnError(t);
            }, function() {
                p.OnNext(s);
                p.OnCompleted();
            });
        });
    };
    g.MinBy = function(m, n) {
        if (m === c)m = e;
        var o;
        if (n === c)o = function(p, q) {
            return q - p;
        }; else o = function(p, q) {
            return n(p, q) * -1;
        };
        return l(this, m, o);
    };
    g.Min = function(m, n) {
        return this.MinBy(m, n).Select(k);
    };
    g.MaxBy = function(m, n) {
        if (m === c)m = e;
        if (n === c)n = function(o, p) {
            return o - p;
        };
        return l(this, m, n);
    };
    g.Max = function(m, n) {
        return this.MaxBy(m, n).Select(k);
    };
})();