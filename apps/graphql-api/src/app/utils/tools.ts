
export const userOwnership = (req, valueToComp)=>{
  if((req._id as string) !== (valueToComp as string)){
      return false
  }
  return true;
}
