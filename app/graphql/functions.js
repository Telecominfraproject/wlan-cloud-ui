export const updateQueryGetAllProfiles = (previousResult, { fetchMoreResult }) => {
  const previousEntry = previousResult.getAllProfiles;
  const newItems = fetchMoreResult.getAllProfiles.items;

  return {
    getAllProfiles: {
      context: { ...fetchMoreResult.getAllProfiles.context },
      items: [...previousEntry.items, ...newItems],
      __typename: previousEntry.__typename,
    },
  };
};
