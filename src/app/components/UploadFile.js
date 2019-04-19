import React from "react";
import gql from "graphql-tag";
import { graphql } from "react-apollo";

const uploadsQuery = gql`
  query uploads {
    uploads {
      id
      filename
      mimetype
      path
    }
  }
`;

const UploadFile = ({ mutate }) => {
    const handleChange = ({
        target: {
            validity,
            files: [file]
        }
    }) =>
        validity.valid &&
        mutate({
            variables: { file },
            update(
                proxy,
                {
                    data: { singleUpload }
                }
            ) {
                const data = proxy.readQuery({ query: uploadsQuery });
                data.uploads.push(singleUpload);
                proxy.writeQuery({ query: uploadsQuery, data });
            }
        });

    return <input type="file" required onChange={handleChange} />;
};

export default graphql(gql`
  mutation($file: Upload!) {
    singleUpload(file: $file) {
      id
      filename
      mimetype
      path
    }
  }
`)(UploadFile);
