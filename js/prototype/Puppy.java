// 定义Puppy类

public class Puppy {
  // 成员变量
  int pupyAge;

  // 构造方法
  public Puppy(age){
    // This constructor has one parameter, age.
    pupyAge = age;
   }

  public void say() {
    System.out.println("Puppy's age is : " + pupyAge);
  }
}