import React from 'react';
import ReactDom from 'react-dom';
import component from 'omniscient';
import immstruct from 'immstruct';
import '../less/index.less';
import {DOM} from 'react';
import $ from "jquery";

let {div} = DOM;

let structure = immstruct({
    players: {}
});

const App = component('App', {

    getInitialState: function() {
        return {
            players: {}
        };
     },

     componentWillMount () {
         this.onSwap = () => {
              this.setState({ players: structure.cursor() });
          };
          structure.on('swap', this.onSwap);
      },

    componentDidMount: function() {
        this.serverRequest = $.getJSON('http://localhost:2403/players', function (result) {
            this.props.players.update(() => result);
        }.bind(this));
        structure.on('swap', this.onSwap);
    },

    componentWillUnmount: function() {
        this.serverRequest.abort();
        structure.off('swap', this.onSwap);
    }
}, function ({ players }) {
    const player = players[0] ? players[0].name : '';
    return (
        <div className="app">
            {player}
        </div>
    );
})



let el = document.querySelector('#app');

function render () {
    ReactDom.render(<App players={structure.cursor().get('players')} />, el);
}
render();
structure.on('swap', render);

window.structure = structure;