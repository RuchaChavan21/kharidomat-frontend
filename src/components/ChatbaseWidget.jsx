import React, { useEffect } from 'react';

// Chatbase widget loader – attaches floating chatbot to bottom-right
const ChatbaseWidget = () => {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Prevent double-initialisation
    if (document.getElementById('HwdifIgDGO8RNikqhpUak')) {
      return;
    }

    // Bootstrap chatbase queue object (same logic as provided snippet)
    if (!window.chatbase || window.chatbase('getState') !== 'initialized') {
      const baseFn = (...args) => {
        if (!baseFn.q) baseFn.q = [];
        baseFn.q.push(args);
      };
      window.chatbase = new Proxy(baseFn, {
        get(target, prop) {
          if (prop === 'q') return target.q;
          return (...args) => target(prop, ...args);
        },
      });
    }

    const onLoad = () => {
      if (document.getElementById('HwdifIgDGO8RNikqhpUak')) return;
      const script = document.createElement('script');
      script.src = 'https://www.chatbase.co/embed.min.js';
      script.id = 'HwdifIgDGO8RNikqhpUak';
      script.domain = 'www.chatbase.co';
      document.body.appendChild(script);
    };

    if (document.readyState === 'complete') {
      onLoad();
    } else {
      window.addEventListener('load', onLoad);
      return () => window.removeEventListener('load', onLoad);
    }
  }, []);

  // Nothing to render – widget is injected via script
  return null;
};

export default ChatbaseWidget;

