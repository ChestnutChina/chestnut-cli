import guideLocal from '../json/guide.json';
import featureLocal from '../json/feature.json';

const getGuide = () => guideLocal;
const getFeature = () => featureLocal;

const getSidebars = () => {
  return {
    "guide": getGuide(),
    "feature": getFeature(),
  };
};

const sidebars = getSidebars();

export default sidebars;
