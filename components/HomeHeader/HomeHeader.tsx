import { Canvas } from "./Canvas";
import style from "./HomeHeader.module.css";
import { LINES } from "./utils";
import * as Grid from "@/components/Grid";

export const HomeHeader = () => {
  return (
    <header style={{ margin: "0 -2ch" }}>
      <Grid.GridProvider>
        <Grid.Content>
          <div
            className={style.wrapper}
            style={{ height: `calc(var(--line) * ${LINES})` }}
          >
            <div className={style.graphic} aria-hidden="true">
              <Canvas />
            </div>
            <h1
              style={{
                fontWeight: "bold",
                letterSpacing: "1ch",
                backgroundColor: "var(--background)",
                position: "relative",
              }}
            >
              NevNein
            </h1>
          </div>
        </Grid.Content>
      </Grid.GridProvider>
    </header>
  );
};
