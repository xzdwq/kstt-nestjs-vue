import tippy, {inlinePositioning} from 'tippy.js';
import 'tippy.js/dist/backdrop.css';
import 'tippy.js/animations/shift-away.css';
import 'tippy.js/themes/light.css';
import 'tippy.js/animations/scale.css';

export default {
  name: 'ttip',
  updated(el, eOpts) {
    if(el._tippy) el._tippy.destroy()
    createTips(el, eOpts)
  },
  mounted(el, eOpts) {
    if(!el._tippy) createTips(el, eOpts)
  }
}

const createTips = (el, eOpts) => {
  let content = eOpts.value
  const displayValue = eOpts.arg?.displayValue
  tippy(el, {
    // content: eOpts.value,
    placement: eOpts.arg?.placement ? eOpts.arg.placement : 'top',
    theme: eOpts.arg?.theme ? eOpts.arg.theme : null,
    appendTo: document.body,
    trigger: eOpts.arg?.trigger ? eOpts.arg.trigger : 'mouseenter',
    touch: true,
    arrow: true,
    delay: 100,
    ignoreAttributes: true,
    allowHTML: true,
    inlinePositioning: true,
    interactive: true,
    maxWidth: 350,
    offset: [0, 6],
    animation: 'scale',
    inertia: true,
    onShow(instance) {
      if(Array.isArray(content)) {
        let cnt = ''
        for(let i = 0; i < content.length; i++) {
          cnt += `${i+1}. ${content[i][displayValue]} <br>`
        }
        instance.setContent(cnt)
      } else {
        instance.setContent(content)
      }
    },
    plugins: [inlinePositioning]
  })
}