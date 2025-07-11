import ActionButton from "./ActionButton";
import * as actions from "../../actions.js";

const getActionName = (params, action) => {
  switch (action.type) {
    case "addExtraTime":
      return "Add Extra Time";
    case "finishHalf":
    case "finishPenaltyShot":
      return "Finish";
    case "finishSetPlay":
      return "Set Play Complete";
    case "freePenaltyShot":
    case "freeSetPlay":
      return "Playing";
    case "globalGameStuck":
      return "Global Game Stuck";
    case "goal":
      return params.competition.challengeMode != null ? "Point" : "Goal";
    case "penalize": {
      const penalty = actions.PENALTIES.find((penalty) => penalty[1] === action.args.call);
      if (penalty) {
        return penalty[0];
      }
      return "Penalize";
    }
    case "selectPenaltyShotPlayer":
      return "Select";
    case "startPenaltyShootout":
      return "Penalty Shoot-out";
    case "startSetPlay":
      switch (action.args.setPlay) {
        case "kickOff":
          return params.competition.challengeMode != null ? "Set" : "Ready";
        case "kickIn":
          return "Kick-in";
        case "goalKick":
          return "Goal Kick";
        case "cornerKick":
          return "Corner Kick";
      }
      break;
    case "substitute":
      return "Substitute";
    case "switchHalf":
      return "Second Half";
    case "switchTeamMode":
      return "Switch Mode";
    case "timeout":
      return action.args.side ? "Timeout" : "Referee Timeout";
    case "unpenalize":
      return "Unpenalize";
    case "waitForPenaltyShot":
    case "waitForSetPlay":
      return "Set";
    case "waitForReady":
      return "Standby";
  }
  return action.type;
};

const UndoPanel = ({ params, undoActions, legalUndoActions }) => {
  return (
    <div className="flex flex-row-reverse gap-2 h-10">
      {legalUndoActions.map((legal, index) => (
        <ActionButton
          action={{ type: "undo", args: { states: index + 1 } }}
          label={index < undoActions.length ? getActionName(params, undoActions[index]) : "Undo"}
          legal={legal}
          key={index}
        />
      ))}
    </div>
  );
};

export default UndoPanel;
