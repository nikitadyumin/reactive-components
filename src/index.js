import React, {Component} from "react";
import {Observable} from "rxjs";
import {withState} from "./state";
import {pipe} from "ramda";
import ReactDOM from "react-dom";

class Spinner extends Component {
    render() {
        const inc = () => this.props.store.next(this.props.value + 1);
        const dec = () => this.props.store.next(this.props.value - 1);
        return (
            <div>
                <button onClick={dec}>-</button>
                <span>{this.props.offset + this.props.value}</span>
                <button onClick={inc}>+</button>
            </div>
        );
    }
}


class Spinners extends Component {

    constructor(...args) {
        super(...args);
        this.state = {
            values: [],
            spinners: [],
            offset: 0
        }
    }

    componentWillMount() {

        const [
            WrappedAmountSpinner,
            amountSpinnerValues
        ] = withState(Spinner, 1);


        const getStream = ([_, stream]) => stream;
        const sum = (x, y) => x + y;

        amountSpinnerValues.subscribe(
            length => {
                const spinners = Array.from({length})
                    .map((_item, index) => {
                        const initialValue = this.state.values[index] || 0;
                        return withState(Spinner, initialValue);
                    });

                this.setState({
                    spinners,
                    values: [],
                    total: 0
                });

                Observable
                    .combineLatest(...spinners.map(getStream))
                    .subscribe(values => {
                        this.setState({
                            values,
                            total: values.reduce(sum, 0)
                        });
                    });
            }
        );

        const [
            WrappedStartSpinner,
            startSpinnerValues
        ] = withState(Spinner, 0);

        this.WrappedAmountSpinner = WrappedAmountSpinner;
        this.WrappedStartSpinner = WrappedStartSpinner;

        startSpinnerValues.subscribe(offset => this.setState({offset}));
    }

    render() {
        const WrappedStartSpinner = this.WrappedStartSpinner;
        const WrappedAmountSpinner = this.WrappedAmountSpinner;

        return (
            <div>
                <div>{this.state.total}</div>
                <WrappedStartSpinner offset={0}/>
                <WrappedAmountSpinner offset={0}/>
                {this.state.spinners.map(([Spinner], i) => <Spinner offset={this.state.offset} key={i}/>)}
            </div>
        );
    }
}

const getValue = e => e.target.value;

class Form extends Component {
    constructor(...args) {
        super(...args);
        this.state = {
            value: {
                firstname: '',
                lastname: ''
            }
        };
    }

    render() {
        const setFirstname = this.props.store.reducer((state, firstname) => Object.assign({}, state, {firstname}));
        const setLastname = this.props.store.reducer((state, lastname) => Object.assign({}, state, {lastname}));

        return (
            <div>
                <input onChange={pipe(getValue, setFirstname)} value={this.state.value.firstname}/>
                <input onChange={pipe(getValue, setLastname)} value={this.state.value.lastname}/>
            </div>
        );
    }
}

const [
    WrappedForm,
    form$
] = withState(Form, {
    firstname: '',
    lastname: ''
});

class App extends Component {
    render() {
        return (
            <div>
                <Spinners />
                <WrappedForm />
            </div>
        );
    }
}

const [
    StatefulApp,
    globalStore
] = withState(App);

const render = state => ReactDOM.render(
    <StatefulApp {...state}/>,
    document.getElementById('app')
);

globalStore.subscribe(render);