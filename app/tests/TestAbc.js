import React from 'react';
import {renderIntoDocument} from 'react-addons-test-utils';

import {expect} from 'chai';

import setup from './setup';

import ReactPureExam from '../src/exam/ReactPureExam';

var nock = require('nock');

describe('#exam', function(){
  it('create exam111', function (){
    var couchdb = nock('http://myapp.iriscouch.com')
                .get('/users/1')
                .reply(200, {
                  _id: '123ABC',
                  _rev: '946B7D1C',
                  username: 'pgte',
                  email: 'pedro.teixeira@gmail.com'
                 });
     
    const form = renderIntoDocument(
      <ReactPureExam />
    );
    const wr = form.refs.wrapd;
  	expect(wr.textContent).to.equal('Hello World');
  })

});
