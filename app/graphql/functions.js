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

export const fetchMoreProfiles = (e, profile, fetchMore) => {
  if (profile.getAllProfiles.context.lastPage) {
    return false;
  }

  e.persist();
  const { target } = e;

  if (target.scrollTop + target.offsetHeight + 10 >= target.scrollHeight) {
    fetchMore({
      variables: { context: { ...profile.getAllProfiles.context } },
      updateQuery: updateQueryGetAllProfiles,
    });
  }

  return true;
};
