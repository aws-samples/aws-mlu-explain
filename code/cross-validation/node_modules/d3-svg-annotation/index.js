import annotation from './src/Adapter-d3'
import { Type, d3Label, d3Callout, d3CalloutCurve, d3CalloutElbow, d3CalloutCircle, 
 d3CalloutRect, d3XYThreshold, d3Badge, customType } from './src/Types-d3'

export {
  annotation,
  Type as annotationTypeBase ,
  d3Label as annotationLabel ,
  d3Callout as annotationCallout ,
  d3CalloutCurve as annotationCalloutCurve ,
  d3CalloutElbow as annotationCalloutElbow ,
  d3CalloutCircle as annotationCalloutCircle ,
  d3CalloutRect as annotationCalloutRect ,
  d3XYThreshold as annotationXYThreshold ,
  d3Badge as annotationBadge ,
  customType as annotationCustomType 
}

export default {
  annotation,
  annotationTypeBase : Type,
  annotationLabel : d3Label,
  annotationCallout : d3Callout,
  annotationCalloutCurve : d3CalloutCurve,
  annotationCalloutElbow : d3CalloutElbow,
  annotationCalloutCircle : d3CalloutCircle,
  annotationCalloutRect : d3CalloutRect,
  annotationXYThreshold : d3XYThreshold,
  annotationBadge : d3Badge,
  annotationCustomType : customType
}