import React, { useCallback } from 'react';

export default function Form({ onSubmit, children, ...prop }) {
  const handleSubmitForm = useCallback(
    e => {
      e.preventDefault();
      const data = new FormData(e.target);
      const submitData = {};
      for (var pair of data.entries()) {
        submitData[pair[0]] = pair[1];
      }
      onSubmit(submitData);
      e.target.reset()
    },
    [onSubmit]
  );

  return (
    <form {...prop} onSubmit={handleSubmitForm}>
      {children}
    </form>
  );
}
