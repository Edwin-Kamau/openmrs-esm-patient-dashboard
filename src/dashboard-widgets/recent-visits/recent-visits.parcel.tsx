import React from "react";
import ReactDOM from "react-dom";
import singleSpaReact from "single-spa-react";
import dayjs from "dayjs";

function RecentVisitsParcel(props: RecentVisitsProps) {
  const [recentVisit, setRecentVisits] = React.useState(null);

  React.useEffect(() => {
    const queryParams = `custom:(uuid,startDatetime,stopDatetime,encounters:(uuid,encounterType:(uuid,display)))`;

    fetch(
      `/openmrs/ws/rest/v1/visit?patient=${props.patientUuid}&v=${queryParams}&limit=3`
    )
      .then(resp => {
        if (resp.ok) {
          return resp.json();
        } else {
          throw Error(
            `Cannot fetch visits ${props.patientUuid} - server responded with '${resp.status}'`
          );
        }
      })
      .then(recentVisit => {
        setRecentVisits(recentVisit);
      });
  }, []);

  return recentVisit ? renderRecentVisits() : renderLoader();

  function renderLoader() {
    return <div>Loading...</div>;
  }

  function renderRecentVisits() {
    if (recentVisit.results.length > 0) {
      return (
        <div className="card">
          <div className="card-header">
            <h5 className="card-title">Recent Visits</h5>
          </div>
          <div className="card-body">
            <table className="table table-bordered">
              <tbody>
                {recentVisit.results.map(visit => renderVisitEncounters(visit))}
              </tbody>
            </table>
          </div>
        </div>
      );
    } else {
      return <div>No recent visits Available</div>;
    }
  }

  function renderVisitEncounters(visit) {
    return (
      <tr>
        <td>
          <a
            href={`/openmrs/coreapps/patientdashboard/patientDashboard.page?patientId=${props.patientUuid}&visitId=${visit.uuid}`}
          >
            {dayjs(visit.startDatetime).format("YYYY-MM-DD")}
          </a>
        </td>
        {renderEncounters(visit.encounters)}
      </tr>
    );
  }
  function renderEncounters(encounters) {
    if (encounters.length > 0) {
      return (
        <td>
          <div className="badge badge-success">
            {encounters
              .map(encounter => {
                return encounter.encounterType.display;
              })
              .join(", ")}
          </div>
        </td>
      );
    } else {
      return <td>No Encounter</td>;
    }
  }
}

type RecentVisitsProps = {
  patientUuid: string;
};

export default singleSpaReact({
  React,
  ReactDOM,
  rootComponent: RecentVisitsParcel,
  suppressComponentDidCatchWarning: true
});
