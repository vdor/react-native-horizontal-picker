# @vseslav/react-native-horizontal-picker
Component for displaying horizontally scrolled picker for React Native

![platforms](https://img.shields.io/badge/platforms-Android%20%7C%20iOS-brightgreen.svg?style=flat-square)

## Example

![@vseslav/react-native-horizontal-picker](https://github.com/vdor/react-native-horizontal-picker/raw/master/example.gif)

## Usage

```bash
$ npm install --save @vseslav/react-native-horizontal-picker
```

```javascript
import HorizontalPicker from '@vseslav/react-native-horizontal-picker';


const Items = Array.from(Array(100).keys());

const rednerItem = (item, index) => (
  <View style={[styles.item], { width: 80 }}>
    <Text style={styles.itemText}>
      { item }
    </Text>
  </View>
);

export default function MyPicker() {
  return (
    <HorizontalPicker
      data={Items}
      renderItem={rednerItem}
      itemWidth={80}
    />
  );
}
```

## Props

### Required

Prop | Description | Type | Default
------ | ------ | ------ | ------
**data** | Array of any items to loop on | Array | **Required**
**renderItem** | Takes an item from data and renders it into the picker. The function receives one argument `{item, index}` and must return a React element. | (item: any, index: number) => ReactNode | **Required**
**itemWidth** | Width in pixels of horizontal pickers's items, **must be the same for all of them** | Number | **Required**


### Not Required
Prop | Description | Type | Default
------ | ------ | ------ | ------
snapTimeout | Number of millisecoonds. When user will drag to scroll, after this time picker will automatically scroll to neartest item | Number | `500`
onChange | Callback called when selected item is changed  | (position: number) => voiod | null
selected | Selected item | Number | null
