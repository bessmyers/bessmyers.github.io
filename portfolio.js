(function (global) {
  var STORAGE_KEY = 'portfolio_unlocked';

  global.PortfolioGate = {
    isUnlocked: function () {
      return sessionStorage.getItem(STORAGE_KEY) === '1';
    },

    unlock: function () {
      sessionStorage.setItem(STORAGE_KEY, '1');
    },

    guardCaseStudy: function () {
      if (!this.isUnlocked()) {
        var target = '../index.html#work';
        window.location.replace(target);
      }
    },

    checkPassword: function (input) {
      return input === 'MyersCD2026';
    }
  };
})(window);
