/**
 * Created by ndyumin on 04.02.2018.
 */
import {BehaviorSubject} from "rxjs";
import React, {Component} from "react";

export const withState = (Component, init) => {
    const store = new BehaviorSubject(init);
    store.reducer = reduce => update => store.next(
        reduce(store.getValue(), update)
    );

    const Wrapped = class extends Component {

        componentWillMount() {
            this.subscription = store
                .distinctUntilChanged((o1, o2) => JSON.stringify(o1) === JSON.stringify(o2))
                .subscribe(value => this.setState({value}, function () {
                    console.log(this.state.value);
                }));
        }

        componentWillUnmount() {
            this.subscription.unsubscribe();
        }

        render() {
            return (
                <Component {...this.props} {...this.state} store={store}/>
            );
        };
    };

    return [
        Wrapped,
        store
    ];
};
