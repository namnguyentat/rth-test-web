// Authors:
//   https://gist.github.com/engelfrost/fd707819658f72b42f55
//   https://gist.github.com/remy/350433

var Storage = function(type) {
  function createCookie(name, value, days) {
    var date, expires

    if (days) {
      date = new Date()
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000)
      expires = '; expires=' + date.toGMTString()
    } else {
      expires = ''
    }
    document.cookie = name + '=' + value + expires + '; path=/'
  }

  function readCookie(name) {
    var nameEQ = name + '=',
      ca = document.cookie.split(';'),
      i,
      c

    for (i = 0; i < ca.length; i++) {
      c = ca[i]
      while (c.charAt(0) === ' ') {
        c = c.substring(1, c.length)
      }

      if (c.indexOf(nameEQ) === 0) {
        return c.substring(nameEQ.length, c.length)
      }
    }
    return null
  }

  function setData(data: Object) {
    data = JSON.stringify((data: Object))
    if (type === 'session') {
      window.name = data
    } else {
      createCookie('localStorage', data, 365)
    }
  }

  function clearData() {
    if (type === 'session') {
      window.name = ''
    } else {
      createCookie('localStorage', '', 365)
    }
  }

  function getData() {
    var data = type === 'session' ? window.name : readCookie('localStorage')
    return data ? JSON.parse((data: Object)) : {}
  }

  // initialise if there's already data
  var data = getData()

  return {
    length: 0,
    clear: function() {
      data = {}
      this.length = 0
      clearData()
    },
    getItem: function(key) {
      return data[key] === undefined ? null : data[key]
    },
    key: function(i) {
      // not perfect, but works
      var ctr = 0
      for (var k in data) {
        if (ctr === i) return k
        else ctr++
      }
      return null
    },
    removeItem: function(key) {
      delete data[key]
      this.length--
      setData((data: Object))
    },
    setItem: function(key, value) {
      data[key] = value + '' // forces the value to a string
      this.length++
      setData((data: Object))
    }
  }
}

var fakeLocalStorage = function() {
  var fakeLocalStorage = new Storage('session')
  var storage

  // If Storage exists we modify it to write to our fakeLocalStorage object instead.
  // If Storage does not exist we create an empty object.
  if (window.Storage && window.localStorage) {
    storage = window.Storage.prototype
  } else {
    // We don't bother implementing a fake Storage object
    window.localStorage = new Storage('session')
    storage = window.localStorage
  }

  // For older IE
  if (!window.location.origin) {
    window.location.origin =
      window.location.protocol +
      '//' +
      window.location.hostname +
      (window.location.port ? ':' + window.location.port : '')
  }

  var dispatchStorageEvent = function(key, newValue) {
    var oldValue = key === null ? null : storage.getItem(key) // `===` to match both null and undefined
    var url = window.location.href.substr(window.location.origin.length)
    var storageEvent = document.createEvent('StorageEvent') // For IE, http://stackoverflow.com/a/25514935/1214183

    storageEvent.initStorageEvent(
      'storage',
      false,
      false,
      key,
      oldValue,
      newValue,
      url,
      null
    )
    window.dispatchEvent(storageEvent)
  }

  storage.key = function(i) {
    return fakeLocalStorage.key(i)
  }

  storage.getItem = function(key) {
    return fakeLocalStorage.getItem(key)
  }

  storage.setItem = function(key, value) {
    dispatchStorageEvent(key, value)
    fakeLocalStorage.setItem(key, value)
  }

  storage.removeItem = function(key) {
    dispatchStorageEvent(key, null)
    fakeLocalStorage.removeItem(key)
  }

  storage.clear = function() {
    dispatchStorageEvent(null, null)
    fakeLocalStorage.clear()
  }
}

// Example of how to use it
if (typeof window.localStorage === 'object') {
  // Safari will throw a fit if we try to use localStorage.setItem in private browsing mode.
  try {
    localStorage.setItem('localStorageTest', 1)
    localStorage.removeItem('localStorageTest')
  } catch (e) {
    fakeLocalStorage()
  }
} else {
  // Use fake localStorage for any browser that does not support it.
  fakeLocalStorage()
}
