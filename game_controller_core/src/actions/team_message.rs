use serde::{Deserialize, Serialize};

use crate::action::{Action, ActionContext};
use crate::types::{Phase, Side, State};

/// This struct defines an action that is triggered when a team message is received.
#[derive(Clone, Debug, Deserialize, PartialEq, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct TeamMessage {
    /// The side which sent the team message.
    pub side: Side,
    /// Whether the message itself has an illegal format.
    pub illegal: bool,
}

impl Action for TeamMessage {
    fn execute(&self, c: &mut ActionContext) {
        // Do not consider messages that arrive while we are still pretending that it is
        // Initial.
        if c.delayed_game()
            .is_some_and(|game| game.state == State::Initial)
        {
            return;
        }
        if c.game.teams[self.side].message_budget == 0 || self.illegal {
            c.game.teams[self.side].illegal_communication = true;
            c.game.teams[self.side].score = 0;
        }
        if c.game.teams[self.side].message_budget > 0 {
            c.game.teams[self.side].message_budget -= 1;
        }
    }

    fn is_legal(&self, c: &ActionContext) -> bool {
        // Team messages are only counted during those states.
        c.game.phase != Phase::PenaltyShootout
            && (c.game.state == State::Ready
                || c.game.state == State::Set
                || c.game.state == State::Playing)
    }
}
