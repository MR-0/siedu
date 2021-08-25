import ReactDOMServer from 'react-dom/server'
import style from './Tooltip.module.scss';

const tooltip = (() => {
  let isVisible = false;
  const body = document.body;
  const node = document.createElement('div');
  const show = (content) => {
    isVisible = true;
    node.classList.add(style.show);
    node.innerHTML = content;
  };
  const hide = () => {
    isVisible = false;
    node.classList.remove(style.show);
    node.innerHTML = '';
  };
  
  node.className = style.tooltip;

  body.addEventListener('mouseover', hide);

  body.addEventListener('mousemove', event => {
    if (isVisible) {
      const { clientX:x, clientY:y } = event;
      node.style.left = (window.scrollX + x) + 'px';
      node.style.top = (window.scrollY + y) + 'px';
    }
  });

  body.appendChild(node);

  return { node, show, hide };
})();

export const Tooltip = ({ children, show }) => {
  const content = ReactDOMServer.renderToString(children);
  
  if (show) tooltip.show(content || '');
  else tooltip.hide();
  
  return null;
}