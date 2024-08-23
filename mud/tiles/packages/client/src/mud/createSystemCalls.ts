/*
 * Create the system calls that the client can use to ask
 * for changes in the World state (using the System contracts).
 */

import { getComponentValue } from "@latticexyz/recs";
import { ClientComponents } from "./createClientComponents";
import { SetupNetworkResult } from "./setupNetwork";
import { encodeEntity, singletonEntity } from "@latticexyz/store-sync/recs";

export type SystemCalls = ReturnType<typeof createSystemCalls>;

export function createSystemCalls(
  /*
   * The parameter list informs TypeScript that:
   *
   * - The first parameter is expected to be a
   *   SetupNetworkResult, as defined in setupNetwork.ts
   *
   *   Out of this parameter, we only care about two fields:
   *   - worldContract (which comes from getContract, see
   *     https://github.com/latticexyz/mud/blob/main/templates/vanilla/packages/client/src/mud/setupNetwork.ts#L63-L69).
   *
   *   - waitForTransaction (which comes from syncToRecs, see
   *     https://github.com/latticexyz/mud/blob/main/templates/vanilla/packages/client/src/mud/setupNetwork.ts#L77-L83).
   *
   * - From the second parameter, which is a ClientComponent,
   *   we only care about Counter. This parameter comes to use
   *   through createClientComponents.ts, but it originates in
   *   syncToRecs
   *   (https://github.com/latticexyz/mud/blob/main/templates/vanilla/packages/client/src/mud/setupNetwork.ts#L77-L83).
   */
  { worldContract, waitForTransaction }: SetupNetworkResult,
  { Counter, Tiles }: ClientComponents,
) {
  const increment = async () => {
    /*
     * Because IncrementSystem
     * (https://mud.dev/templates/typescript/contracts#incrementsystemsol)
     * is in the root namespace, `.increment` can be called directly
     * on the World contract.
     */
    const tx = await worldContract.write.app__increment();
    await waitForTransaction(tx);
    return getComponentValue(Counter, singletonEntity);
  };

  const placeTile = async (gameId, x, y, buildingType, sender) => {
    console.log("placeTile");
    const tx = await worldContract.write.app__placeTile(gameId, x, y, buildingType, sender);
    await waitForTransaction(tx);
  };

  const configGame = async () => {
    console.log("configGame");
    const tx = await worldContract.write.app__configGame([
      1, // gameId,
      10, // xSize,
      5, // ySize,
      5, // baseRate,
      1, // bonusSame,
      -1, // bonusEnemy,
      2, // bonusVictim,
      0 // pricePerTile
    ]);
    await waitForTransaction(tx);
  };


  return {
    increment,
    placeTile,
    configGame,
  };
}
