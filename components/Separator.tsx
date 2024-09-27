import { Graphic } from "./Graphic";
import { BORDERS } from "./utils";

export const Separator = ({
  width,
  type,
  weight = "normal",
}: {
  width: number;
  type: "single" | "double";
  weight?: "normal" | "bold";
}) => {
  return (
    <Graphic weight={weight}>
      {new Array(width).fill(BORDERS[type].h).join("")}
    </Graphic>
  );
};
