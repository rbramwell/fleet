package service

import (
	"context"

	"github.com/kolide/fleet/server/kolide"
)

func (mw validationMiddleware) InviteNewUser(ctx context.Context, payload kolide.InvitePayload) (*kolide.Invite, error) {
	invalid := &invalidArgumentError{}
	if payload.Email == nil {
		invalid.Append("email", "missing required argument")
	}
	if payload.InvitedBy == nil {
		invalid.Append("invited_by", "missing required argument")
	}
	if payload.Admin == nil {
		invalid.Append("admin", "missing required argument")
	}
	if invalid.HasErrors() {
		return nil, invalid
	}
	return mw.Service.InviteNewUser(ctx, payload)
}
