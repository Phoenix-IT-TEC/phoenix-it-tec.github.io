import { ControllerParams } from '@wix/yoshi-flow-editor';

import { IFrameEvent, Nullable } from '../types';
import { Store } from '../store';
import {
  getSetViewedMemberAction,
  getToggleIsSavingProfileAction,
  getPatchGlobalSettingsAction,
} from '../store/actions';

type DataSyncAction = ReturnType<
  typeof getPatchGlobalSettingsAction | typeof getToggleIsSavingProfileAction
>;

interface PubSubEvent {
  name: string;
  data: {
    compId: string;
    action: DataSyncAction;
  };
}

export enum WidgetEvent {
  SetViewedMember = 'pw.set_viewed_member',
}

const actionMap = {
  [WidgetEvent.SetViewedMember]: getSetViewedMemberAction,
};

const payloadMap = {
  [WidgetEvent.SetViewedMember]: (store: Store) => {
    const state = store.getState();
    return state.users.viewed;
  },
};

type DataSyncHandler = (event: PubSubEvent) => void;

type PlatformAPIs = ControllerParams['controllerConfig']['platformAPIs'];

export default class DataSyncService {
  private widgetEvents: WidgetEvent[] = [];
  private iFrameEvents: IFrameEvent[] = [];
  private subscriptionId: Nullable<number> = null;
  private readonly eventName = 'members_area.pw_ooi_store_action';

  constructor(private compId: string, private pubSub: PlatformAPIs['pubSub']) {}

  scheduleEvent(event: WidgetEvent) {
    this.widgetEvents.push(event);

    if (event === WidgetEvent.SetViewedMember) {
      this.addIFrameEvent(IFrameEvent.SetViewedMember);
    }
  }

  emitEvent(action: DataSyncAction) {
    const payload = { action, compId: this.compId };
    this.pubSub.publish(this.eventName, payload, false);
  }

  emitEvents(store: Store) {
    if (!this.widgetEvents.length) {
      return;
    }

    const events = this.widgetEvents;
    this.widgetEvents = [];

    events.forEach((event) => {
      this.dispatchToPubSub(event, store);
    });
  }

  purgeIFrameEvents() {
    if (!this.iFrameEvents.length) {
      return this.iFrameEvents;
    }

    const events = this.iFrameEvents;
    this.iFrameEvents = [];
    return events;
  }

  registerListeners(store: Store) {
    if (this.subscriptionId !== null) {
      return;
    }

    this.initSubscriptions(store);
  }

  unregisterListeners() {
    if (this.subscriptionId !== null) {
      this.pubSub.unsubscribe(this.eventName, this.subscriptionId);
    }
  }

  addIFrameEvent(event: IFrameEvent) {
    this.iFrameEvents.push(event);
  }

  private dispatchToPubSub<T extends WidgetEvent>(event: T, store: Store) {
    const actionPayload = payloadMap[event](store);
    const actionCreator = actionMap[event];
    const action = actionCreator(actionPayload);
    const payload = { action, compId: this.compId };

    this.pubSub.publish(this.eventName, payload, false);
  }

  private initSubscriptions(store: Store) {
    const eventHandler: DataSyncHandler = (event) => {
      if (this.shouldHandleEvent(event)) {
        store.dispatch(event.data.action);
      }
    };

    this.subscriptionId = this.pubSub.subscribe(
      this.eventName,
      eventHandler,
      false,
    );
  }

  private shouldHandleEvent(event: PubSubEvent) {
    const eventNameMatches = this.eventName === event.name;
    const compIdMatches = this.compId === event.data?.compId;

    return eventNameMatches && !compIdMatches;
  }
}

export const createDataSyncService = (
  compId: string,
  pubSub: PlatformAPIs['pubSub'],
) => new DataSyncService(compId, pubSub);
