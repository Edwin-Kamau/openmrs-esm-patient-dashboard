import React from "react";
import ReactDOM from "react-dom";
import singleSpaReact from "single-spa-react";
import { BrowserRouter, Link } from "react-router-dom";

function FormsParcel(props: FromsParcelProps) {
  const [forms, setForms] = React.useState([]);

  React.useEffect(() => {
    fetch(`/openmrs/ws/rest/v1/form?v=full`)
      .then(resp => {
        if (resp.ok) {
          return resp.json();
        } else {
          throw Error(
            `Cannot fetch forms - server responded with '${resp.status}'`
          );
        }
      })
      .then(forms => {
        forms = forms.results;
        setForms(forms);
      });
  }, []);

  return (
    <BrowserRouter basename="/openmrs/spa">
      <div className="card">
        <div className="card-header">
          {" "}
          <h2>Forms</h2>
        </div>
        <div className="card-body">
          {forms.map((item, i) => {
            return (
              <ul className="list-group">
                <li className="list-group-item" key={i}>
                  <Link
                    to={`/patient-dashboard/${props.patientUuid}/formentry/${item.uuid}?encounterTypeUuid=${item.encounterType.uuid}`}
                  >
                    {item.display}
                  </Link>
                </li>
              </ul>
            );
          })}
        </div>
      </div>
    </BrowserRouter>
  );

  function renderLoader() {
    return <div>Loading...</div>;
  }
}

type FromsParcelProps = {
  patientUuid: string;
};

export default singleSpaReact({
  React,
  ReactDOM,
  rootComponent: FormsParcel,
  suppressComponentDidCatchWarning: true
});
