import { VRM, VRMHumanBoneName } from '@pixiv/three-vrm';

/**
 * Applies a simple, relaxed standing pose to a loaded VRM avatar.
 * Designed to replace the temporary T-pose arm override with a natural idle pose.
 */
export function applyRelaxedPose(vrm: VRM) {
  const humanoid = vrm.humanoid;
  if (!humanoid) return;

  // Upper arms down along the body with slight forward angle
  const lUpperArm = humanoid.getNormalizedBoneNode(VRMHumanBoneName.LeftUpperArm);
  const rUpperArm = humanoid.getNormalizedBoneNode(VRMHumanBoneName.RightUpperArm);

  if (lUpperArm) lUpperArm.rotation.set(0.2, 0.0, 1.32); // ~75° down, slight forward
  if (rUpperArm) rUpperArm.rotation.set(0.2, 0.0, -1.32);

  // Elbows slightly bent for a relaxed look
  const lLowerArm = humanoid.getNormalizedBoneNode(VRMHumanBoneName.LeftLowerArm);
  const rLowerArm = humanoid.getNormalizedBoneNode(VRMHumanBoneName.RightLowerArm);

  if (lLowerArm) lLowerArm.rotation.set(-0.35, 0.0, 0.05);
  if (rLowerArm) rLowerArm.rotation.set(-0.35, 0.0, -0.05);

  // Hands slightly rotated inward
  const lHand = humanoid.getNormalizedBoneNode(VRMHumanBoneName.LeftHand);
  const rHand = humanoid.getNormalizedBoneNode(VRMHumanBoneName.RightHand);

  if (lHand) lHand.rotation.set(0.0, 0.0, 0.12);
  if (rHand) rHand.rotation.set(0.0, 0.0, -0.12);

  // Subtle posture adjustments (very small)
  const chest = humanoid.getNormalizedBoneNode(VRMHumanBoneName.Chest);
  const spine = humanoid.getNormalizedBoneNode(VRMHumanBoneName.Spine);
  const neck = humanoid.getNormalizedBoneNode(VRMHumanBoneName.Neck);

  if (spine) spine.rotation.set(0.02, 0.0, 0.0);
  if (chest) chest.rotation.set(-0.04, 0.0, 0.0);
  if (neck) neck.rotation.set(0.03, 0.0, 0.0);

  // Pelvis and legs for natural stance
  const hips = humanoid.getNormalizedBoneNode(VRMHumanBoneName.Hips);
  if (hips) hips.rotation.set(0.02, 0.03, 0.02);

  const lUpperLeg = humanoid.getNormalizedBoneNode(VRMHumanBoneName.LeftUpperLeg);
  const rUpperLeg = humanoid.getNormalizedBoneNode(VRMHumanBoneName.RightUpperLeg);
  if (lUpperLeg) lUpperLeg.rotation.set(0.1, 0.05, 0.02);
  if (rUpperLeg) rUpperLeg.rotation.set(0.1, -0.05, -0.02);

  const lLowerLeg = humanoid.getNormalizedBoneNode(VRMHumanBoneName.LeftLowerLeg);
  const rLowerLeg = humanoid.getNormalizedBoneNode(VRMHumanBoneName.RightLowerLeg);
  if (lLowerLeg) lLowerLeg.rotation.set(-0.12, 0.0, 0.0);
  if (rLowerLeg) rLowerLeg.rotation.set(-0.08, 0.0, 0.0);

  const lFoot = humanoid.getNormalizedBoneNode(VRMHumanBoneName.LeftFoot);
  const rFoot = humanoid.getNormalizedBoneNode(VRMHumanBoneName.RightFoot);
  if (lFoot) lFoot.rotation.set(0.02, 0.02, 0.01);
  if (rFoot) rFoot.rotation.set(0.02, -0.02, -0.01);
}

