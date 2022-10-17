import { Pipe, PipeTransform } from '@angular/core';
import { State } from '../enums/state.enum';

@Pipe({
  name: 'stateArticleToName'
})
export class StateArticleToNamePipe implements PipeTransform {

  transform(value: State, ...args: unknown[]): string {
    if(value == State.Approved){
      return "Approved!";
    }
    if(value == State.Waiting){
      return "Waiting...";
    }
    if(value == State.Declined){
      return "Declined :(";
    }
    return "";
  }

}
