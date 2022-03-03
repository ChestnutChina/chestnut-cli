import{_ as e,c as s,o as a,a as i}from"./app.eef76fc8.js";const m='{"title":"\u5E38\u89C1\u95EE\u9898","description":"","frontmatter":{},"headers":[{"level":2,"title":"\u5E38\u89C1\u95EE\u9898","slug":"\u5E38\u89C1\u95EE\u9898"},{"level":3,"title":"\u7F16\u8F91\u5668\u7684\u7EC8\u7AEF\u65E0\u6CD5\u4F7F\u7528","slug":"\u7F16\u8F91\u5668\u7684\u7EC8\u7AEF\u65E0\u6CD5\u4F7F\u7528"},{"level":3,"title":"ESLint \u95EE\u9898","slug":"eslint-\u95EE\u9898"},{"level":3,"title":"ESLint \u7684\u89C4\u5219","slug":"eslint-\u7684\u89C4\u5219"},{"level":3,"title":"commitizen \u5B89\u88C5\u95EE\u9898","slug":"commitizen-\u5B89\u88C5\u95EE\u9898"},{"level":3,"title":"\u5173\u4E8E Git \u7684\u94A9\u5B50\u4E0D\u751F\u6548\u95EE\u9898","slug":"\u5173\u4E8E-git-\u7684\u94A9\u5B50\u4E0D\u751F\u6548\u95EE\u9898"}],"relativePath":"guide/faq.md"}',t={},n=i(`<h2 id="\u5E38\u89C1\u95EE\u9898" tabindex="-1">\u5E38\u89C1\u95EE\u9898 <a class="header-anchor" href="#\u5E38\u89C1\u95EE\u9898" aria-hidden="true">#</a></h2><p>\u4EE5\u4E0B\u6574\u7406\u4E86\u4E00\u4E9B\u5E38\u89C1\u7684\u95EE\u9898\uFF0C\u5728\u63D0\u95EE\u4E4B\u524D\u5EFA\u8BAE\u627E\u627E\u6709\u6CA1\u6709\u7C7B\u4F3C\u7684\u95EE\u9898\u3002</p><h3 id="\u7F16\u8F91\u5668\u7684\u7EC8\u7AEF\u65E0\u6CD5\u4F7F\u7528" tabindex="-1">\u7F16\u8F91\u5668\u7684\u7EC8\u7AEF\u65E0\u6CD5\u4F7F\u7528 <a class="header-anchor" href="#\u7F16\u8F91\u5668\u7684\u7EC8\u7AEF\u65E0\u6CD5\u4F7F\u7528" aria-hidden="true">#</a></h3><p>\u5982\u679C\u51FA\u73B0\u4EE5\u4E0B\u60C5\u51B5</p><div class="language-bash"><pre><code>chestnut-cli <span class="token builtin class-name">:</span> \u65E0\u6CD5\u52A0\u8F7D\u6587\u4EF6 \uFF08\u8FD9\u662F\u8DEF\u5F84\uFF09\uFF0C\u56E0\u4E3A\u5728\u6B64\u7CFB\u7EDF\u4E0A\u7981\u6B62\u8FD0\u884C\u811A\u672C\u3002\u6709\u5173\u8BE6\u7EC6\u4FE1\u606F<span class="token punctuation">..</span>.
</code></pre></div><p>\u56E0\u4E3A\u8FD9\u6D89\u53CA\u5230\u7535\u8111\u6743\u9650\u7684\u95EE\u9898\uFF0C\u53EF\u4EE5\u5C1D\u8BD5\u6267\u884C\u4EE5\u4E0B\u64CD\u4F5C\uFF1A</p><ol><li><p>\u4EE5\u7BA1\u7406\u5458\u8EAB\u4EFD\u8FD0\u884C<strong>Windows PowerShell</strong></p></li><li><p>\u7136\u540E\u8FD0\u884C\u4EE5\u4E0B\u547D\u4EE4</p><div class="language-bash"><pre><code>get-ExecutionPolicy
</code></pre></div></li><li><p>\u5982\u679C\u51FA\u73B0\u7ED3\u679C\u4E3A\uFF1A<strong>Restricted</strong>\uFF08\u8868\u793A\u72B6\u6001\u662F\u7981\u6B62\uFF09</p></li><li><p>\u7136\u540E\u63A5\u7740\u6267\u884C</p><div class="language-bash"><pre><code>set-ExecutionPolicy RemoteSigned
</code></pre></div></li><li><p>\u7EE7\u7EED\u6267\u884C\u67E5\u770B\u547D\u4EE4\uFF1A</p><div class="language-bash"><pre><code>get-ExecutionPolicy
</code></pre></div></li><li><p>\u5982\u679C\u8F93\u51FA\uFF1A<strong>RemoteSigned</strong>\uFF08\u8868\u793A\u4FEE\u6539\u6210\u529F\uFF09</p></li></ol><p>\u5982\u679C\u4EE5\u4E0A\u64CD\u4F5C\u65E0\u6CD5\u89E3\u51B3\uFF0C\u8BF7\u81EA\u884C\u67E5\u9605\u76F8\u5173\u8D44\u6599</p><h3 id="eslint-\u95EE\u9898" tabindex="-1">ESLint \u95EE\u9898 <a class="header-anchor" href="#eslint-\u95EE\u9898" aria-hidden="true">#</a></h3><ul><li>\u8FD9\u6709\u53EF\u80FD\u662F\u56E0\u4E3A\u4F60\u7684\u9879\u76EE\u4E0A\u7684\u67D0\u4E9B package \u5305\u8DDF\u5F53\u524D\u5B89\u88C5\u7684 eslint \u4EE5\u53CA\u76F8\u5173\u63D2\u4EF6\u5305\u53D1\u751F\u4E86\u51B2\u7A81\u5BFC\u81F4\uFF0C\u9700\u8981\u6839\u636E\u5B9E\u9645\u60C5\u51B5\u53BB\u66F4\u6539\u7248\u672C</li><li>\u6709\u53EF\u80FD\u662F.eslintrc.js \u7B49\u914D\u7F6E\u6587\u4EF6\u8DDF\u4F60\u7684\u9879\u76EE\u6709\u51B2\u7A81\uFF0C\u6BD4\u5982\u672C\u5DE5\u5177\u63D0\u4F9B\u7684\u662F\u542B\u6709 vue3 \u7684\u529F\u80FD\uFF0C\u4F60\u53EF\u4EE5\u662F vue2\uFF0C\u90A3\u4E48\u9700\u8981\u6839\u636E\u5B9E\u9645\u60C5\u51B5\u53BB\u66F4\u6362</li></ul><p>\u56E0\u4E3A\u4E0D\u53EF\u80FD\u505A\u5230\u9002\u5E94\u6240\u6709\u7684\u9879\u76EE\u9700\u6C42</p><h3 id="eslint-\u7684\u89C4\u5219" tabindex="-1">ESLint \u7684\u89C4\u5219 <a class="header-anchor" href="#eslint-\u7684\u89C4\u5219" aria-hidden="true">#</a></h3><p>\u672C\u5DE5\u5177\u63D0\u4F9B\u7684\u53EA\u662F\u4E00\u4E2A\u6A21\u677F\uFF0C\u5982\u679C\u9700\u8981\u66F4\u591A\u89C4\u5219\u6216\u8005\u66F4\u6539\u89C4\u5219\uFF0C\u53EF\u4EE5\u81EA\u884C\u4FEE\u6539</p><h3 id="commitizen-\u5B89\u88C5\u95EE\u9898" tabindex="-1">commitizen \u5B89\u88C5\u95EE\u9898 <a class="header-anchor" href="#commitizen-\u5B89\u88C5\u95EE\u9898" aria-hidden="true">#</a></h3><p>\u8FD9\u4E2A\u5305\u672C\u5DE5\u5177\u63D0\u4F9B\u7684\u662F\u5168\u5C40\u5B89\u88C5\u7684\u65B9\u5F0F\uFF0C\u4F46\u662F\u7531\u4E8E Mac \u8DDF Windows \u6709\u5DEE\u5F02\uFF0C\u5982\u679C\u662F<strong>Mac</strong>\uFF0C\u90A3\u4E48\u53EF\u80FD\u4F1A\u6709\u6743\u9650\u7684\u95EE\u9898\u5BFC\u81F4\u5728\u6267\u884C<strong>Commiit Message Style</strong> \u914D\u7F6E\u7684\u65F6\u5019\u4F1A\u5931\u8D25\uFF0C\u90A3\u4E48\u8BF7\u81EA\u884C\u7528 sudo \u7684\u65B9\u5F0F\u5168\u5C40\u5B89\u88C5\u8FD9\u4E2A\u5305\uFF0C\u7136\u540E\u518D\u91CD\u65B0\u6267\u884C\u914D\u7F6E\u547D\u4EE4</p><h3 id="\u5173\u4E8E-git-\u7684\u94A9\u5B50\u4E0D\u751F\u6548\u95EE\u9898" tabindex="-1">\u5173\u4E8E Git \u7684\u94A9\u5B50\u4E0D\u751F\u6548\u95EE\u9898 <a class="header-anchor" href="#\u5173\u4E8E-git-\u7684\u94A9\u5B50\u4E0D\u751F\u6548\u95EE\u9898" aria-hidden="true">#</a></h3><p>\u5728\u9009\u62E9<strong>Git Hooks</strong>\u914D\u7F6E\u5B8C\u6210\u540E</p><p><strong>\u67E5\u770B\u6839\u76EE\u5F55\u4E0B<code>.husky</code>\u7684\u6587\u4EF6\u5939\u4E2D\u662F\u5426\u5B58\u5728\u4E0B\u5212\u7EBF<code>_</code>\u8FD9\u4E2A\u6587\u4EF6\u5939\uFF0C\u5982\u679C\u4E0D\u5B58\u5728\uFF0C\u8BF7\u6267\u884C\u4E00\u6B21\u4EE5\u4E0B\u547D\u4EE4\uFF1A</strong></p><div class="language-bash"><pre><code>npx husky <span class="token function">install</span>
</code></pre></div><p><strong>\u5982\u679C\u4F60\u7684\u7535\u8111\u662F Mac\uFF0C\u90A3\u4E48\u6709\u53EF\u80FD\u4F1A\u51FA\u73B0\u6743\u9650\u95EE\u9898\uFF1A</strong></p><ul><li>\u5982\u679C\u6839\u76EE\u5F55\u4E0B<code>.husky</code>\u7684\u6587\u4EF6\u5939\u4E2D\u5B58\u5728<code>pre-commit</code>\u8FD9\u4E2A\u6587\u4EF6\uFF0C\u8BF7\u5220\u9664\uFF0C\u7136\u540E\u6267\u884C:<div class="language-bash"><pre><code>npx husky <span class="token function">add</span> .husky/pre-commit <span class="token string">&quot;npx lint-staged&quot;</span>
</code></pre></div></li><li>\u5982\u679C\u6839\u76EE\u5F55\u4E0B<code>.husky</code>\u7684\u6587\u4EF6\u5939\u4E2D\u5B58\u5728<code>commit-msg</code>\u8FD9\u4E2A\u6587\u4EF6\uFF0C\u8BF7\u5220\u9664\uFF0C\u7136\u540E\u6267\u884C:<div class="language-bash"><pre><code>npx husky <span class="token function">add</span> .husky/commit-msg <span class="token string">&quot;npx --no-install commitlint --edit <span class="token variable">$1</span>&quot;</span>
</code></pre></div></li></ul>`,21),o=[n];function l(c,d,r,p,h,u){return a(),s("div",null,o)}var _=e(t,[["render",l]]);export{m as __pageData,_ as default};
