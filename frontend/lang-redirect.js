// Redirects "/" to the language build the visitor asked for. The value from localStorage is
// attacker-controllable once an XSS ever happens, so it is checked against the known languages
// instead of being pasted into the target address.
(function () {
  var supported = ['de', 'fr'];
  var saved = localStorage.getItem('lang');
  var browserLang = navigator.language.startsWith('fr') ? 'fr' : 'de';
  var lang = supported.includes(saved) ? saved : browserLang;
  globalThis.location.replace(
    '/' + lang + '/' + globalThis.location.search + globalThis.location.hash,
  );
})();
