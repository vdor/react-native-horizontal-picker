import React, { PureComponent, ReactNode } from 'react';
import {
  View,
  ScrollView,
  ScrollViewProps,
  TouchableWithoutFeedback,
  LayoutChangeEvent,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Platform,
} from 'react-native';


export interface HorizontalPickerProps extends ScrollViewProps {
  data: any[],
  renderItem: (item: any, index: number) => ReactNode,
  itemWidth: number,
  defaultIndex?: number,
  snapTimeout?: number
  onChange?: (position: number) => void
};


export type HorizontalPickerState = {
  scrollViewWidth: number
};



export default class HorizontalPicker extends PureComponent<HorizontalPickerProps, HorizontalPickerState> {
  private paddingSide: number;
  private refScrollView: React.RefObject<ScrollView>;
  private ignoreNextScroll: boolean;
  private timeoutDelayedSnap: number | NodeJS.Timeout;
  private currentPositionX: number;
  private readonly defaultScrollEventThrottle = 16;
  private readonly defaultDecelerationRate = Platform.OS == "ios" ? 50 : 0.9;
  private readonly defaultSnapTimeout = 500;

  constructor(props: HorizontalPickerProps) {
    super(props);
    this.paddingSide = 0;
    this.refScrollView = React.createRef();
    this.ignoreNextScroll = false;
    this.timeoutDelayedSnap = 0;
    this.currentPositionX = 0;

    this.state = {
      scrollViewWidth: 0,
    };
  }

  private onLayoutScrollView = (e: LayoutChangeEvent) => {
    this.scrollToDefaultIndex();
    const { width } = e.nativeEvent.layout;
    this.setState(() => ({ scrollViewWidth: width }));
    this.paddingSide = width / 2 - this.props.itemWidth / 2;

    if (this.props.onLayout != null) {
      this.props.onLayout(e);
    }
  }

  private onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    this.currentPositionX = e.nativeEvent.contentOffset.x;

    if (this.props.onScroll != null) {
      this.props.onScroll(e);
    }
  }

  private onScrollBeginDrag = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    this.ignoreNextScroll = false;

    if (this.props.onScrollBeginDrag != null) {
      this.props.onScrollBeginDrag(e);
    }
  }

  private onScrollEndDrag = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    this.cancelDelayedSnap();
    if (this.ignoreNextScroll) {
      this.ignoreNextScroll = false;
    } else {
      this.setDelayedSnap();
    }

    if (this.props.onScrollEndDrag != null) {
      this.props.onScrollEndDrag(e);
    }
  }

  private onMomentumScrollBegin = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    this.ignoreNextScroll = false;
    this.setDelayedSnap();

    if (this.props.onMomentumScrollBegin != null) {
      this.props.onMomentumScrollBegin(e);
    }
  }

  private onMomentumScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (this.ignoreNextScroll) {
      this.ignoreNextScroll = false;
    } else {
      this.setDelayedSnap();
    }

    if (this.props.onMomentumScrollEnd != null) {
      this.props.onMomentumScrollEnd(e);
    }
  }

  public scrollToPosition = (position: number) => {
    const { itemWidth, onChange } = this.props;
    const x = position * itemWidth;
    this.ignoreNextScroll = true;

    if (this.refScrollView.current != null) {
      this.refScrollView.current.scrollTo({ x, y: 0, animated: true });
    }
    
    if (onChange != null) {
      if (position < 1) {
        onChange(0);
      } else if (position > this.props.data.length) {
        onChange(this.props.data.length - 1);
      } else {
        onChange(position);
      }
    }
  }

  private cancelDelayedSnap = () => {
    clearTimeout(this.timeoutDelayedSnap as NodeJS.Timeout);
  }

  private setDelayedSnap = (timeout?: number) => {
    const snapTimeout = timeout || this.props.snapTimeout || this.defaultSnapTimeout;
    const {
      itemWidth,
    } = this.props;
    this.cancelDelayedSnap();
    this.timeoutDelayedSnap = setTimeout(() => {
      const nextPosition = Math.round(this.currentPositionX / itemWidth);
      this.scrollToPosition(nextPosition);
    }, snapTimeout);
  }

  scrollToDefaultIndex = () => {
    if (this.refScrollView.current != null && this.props.defaultIndex != null) {
        const {defaultIndex, itemWidth, data} = this.props;

        if (defaultIndex >= data.length) {
          console.warn("@vseslav/react-native-horizontal-picker: 'defaultIndex' is out of range of the array 'data'");
          return;
        }

        const x = defaultIndex * itemWidth;
        this.refScrollView.current.scrollTo({ x, y: 0, animated: false });
    }
  }
  
  render() {
    const {
      data,
      renderItem,
      ...props
    } = this.props;

    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={this.defaultScrollEventThrottle}
        decelerationRate={this.defaultDecelerationRate}
        contentContainerStyle={{ paddingHorizontal: this.paddingSide }}
        ref={this.refScrollView}
        onLayout={this.onLayoutScrollView}
        onScroll={this.onScroll}
        onScrollBeginDrag={this.onScrollBeginDrag}
        onScrollEndDrag={this.onScrollEndDrag}
        onMomentumScrollBegin={this.onMomentumScrollBegin}
        onMomentumScrollEnd={this.onMomentumScrollEnd}
        {...props}
      >
        {
          data.map((item: any, index: number) => (
            <TouchableWithoutFeedback onPress={() => this.scrollToPosition(index)} key={index}>
              <View>
                {
                  renderItem(item, index)
                }
              </View>
            </TouchableWithoutFeedback>
          ))
        }
      </ScrollView>
    );
  }
}
