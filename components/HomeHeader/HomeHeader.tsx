import { Canvas } from "./Canvas";
import style from "./HomeHeader.module.css";
import * as Grid from "@/components/Grid";

export const HomeHeader = () => {
  return (
    <div className={style.container}>
      <header className={style.header}>
        <Grid.GridProvider>
          <Grid.Content>
            <div className={style.wrapper}>
              <div className={style.graphic} aria-hidden="true">
                <Canvas />
              </div>
              <h1 className={style.title}>NevNein</h1>
            </div>
          </Grid.Content>
        </Grid.GridProvider>
        <p className={style.hint}>Click to cycle animations</p>
      </header>
    </div>
  );
};
