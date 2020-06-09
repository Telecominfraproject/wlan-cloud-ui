import React from 'react';
import PropTypes from 'prop-types';
import { PopoverMenuContent as PopOverMenuContent } from '@tip-wlan/wlan-cloud-ui-library';

const PopoverMenuContent = ({ locationData, setAddModal, setEditModal, setDeleteModal }) => {
  return (
    <PopOverMenuContent
      locationData={locationData}
      setAddModal={setAddModal}
      setEditModal={setEditModal}
      setDeleteModal={setDeleteModal}
    />
  );
};

PopoverMenuContent.propTypes = {
  locationData: PropTypes.shape({
    id: PropTypes.number,
    lastModifiedTimestamp: PropTypes.string,
    locationType: PropTypes.string,
    name: PropTypes.string,
    parentId: PropTypes.number,
  }),
  setEditModal: PropTypes.func.isRequired,
  setAddModal: PropTypes.func.isRequired,
  setDeleteModal: PropTypes.func.isRequired,
};

PopoverMenuContent.defaultProps = {
  locationData: {},
};

export default PopoverMenuContent;
