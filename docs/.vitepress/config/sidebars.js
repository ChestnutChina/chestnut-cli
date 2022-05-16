import guideLocal from '../json/guide.json';
import featureLocal from '../json/feature.json';
import webglLocal from '../json/webgl.json';

const getGuide = () => guideLocal;
const getFeature = () => featureLocal;
const getWebGL = () => webglLocal;

const getSidebars = () => {
  return {
    "guide": getGuide(),
    "feature": getFeature(),
    "webgl": getWebGL(),
  };
};

const sidebars = getSidebars();

export default sidebars;
