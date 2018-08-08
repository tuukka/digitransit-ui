import React from 'react';
import { expect } from 'chai';
import { beforeEach, describe, it } from 'mocha';

import { mockContext, mockChildContextTypes } from './helpers/mock-context';
import { mountWithIntl } from './helpers/mock-intl-enzyme';
import DTAutosuggestPanel from '../../app/component/DTAutosuggestPanel';

describe('<DTAutosuggestPanel />', () => {
  let context;
  let childContextTypes;
  let mockData;

  beforeEach(() => {
    context = { ...mockContext };
    childContextTypes = { ...mockChildContextTypes };
    mockData = {
      breakpoint: 'large',
      origin: {
        lat: 60.169196,
        lon: 24.957674,
        address: 'Aleksanterinkatu, Helsinki',
        set: true,
        ready: true,
      },
      destination: {
        lat: 60.199093,
        lon: 24.940536,
        address: 'Opastinsilta 6, Helsinki',
        set: true,
        ready: true,
      },
      isItinerary: true,
      isViaPoint: true,
      viaPointNames: [' '],
      originPlaceHolder: 'give-origin',
      searchType: 'endpoint',
    };
  });

  it('should not show the slack time panel by default', () => {
    const wrapper = mountWithIntl(<DTAutosuggestPanel {...mockData} />, {
      context,
      childContextTypes,
    });

    expect(
      wrapper.find('.input-viapoint-slack-container').get(0).props.style,
    ).to.have.property('display', 'none');
  });

  it('should show the slack time panel after click', () => {
    const wrapper = mountWithIntl(<DTAutosuggestPanel {...mockData} />, {
      context,
      childContextTypes,
    });

    wrapper.find('.addViaPointSlack').simulate('click');
    expect(
      wrapper.find('.input-viapoint-slack-container').get(0).props.style,
    ).to.have.property('display', 'flex');
  });

  it('should show only the related slack time panel after click (with empty via points)', () => {
    const props = {
      ...mockData,
      viaPointNames: [' ', ' '],
    };
    const wrapper = mountWithIntl(<DTAutosuggestPanel {...props} />, {
      context,
      childContextTypes,
    });

    wrapper
      .find('.addViaPointSlack')
      .first()
      .simulate('click');

    const containers = wrapper.find('.input-viapoint-slack-container');
    expect(containers).to.have.lengthOf(2);
    expect(containers.get(0).props.style).to.have.property('display', 'flex');
    expect(containers.get(1).props.style).to.have.property('display', 'none');
  });

  it('should show only the related slack time panel after click (with filled via points)', () => {
    const props = {
      ...mockData,
      viaPointNames: [
        'Kalasatama, Helsinki::60.187571,24.976301',
        'Kamppi, Helsinki::60.168438,24.929283',
        'Kalasatama, Helsinki::60.187571,24.976301',
      ],
    };
    const wrapper = mountWithIntl(<DTAutosuggestPanel {...props} />, {
      context,
      childContextTypes,
    });

    wrapper
      .find('.addViaPointSlack')
      .first()
      .simulate('click');

    const containers = wrapper.find('.input-viapoint-slack-container');
    expect(containers).to.have.lengthOf(3);
    expect(containers.get(0).props.style).to.have.property('display', 'flex');
    expect(containers.get(1).props.style).to.have.property('display', 'none');
    expect(containers.get(2).props.style).to.have.property('display', 'none');
  });
});
